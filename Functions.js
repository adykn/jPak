// jPak 1808
function jPak(a) {
    if (a.leavePopUpOpen === undefined) a.leavePopUpOpen = 'false';
    if (a.returnAction === undefined) a.returnAction = "refreshAll";  /*noReturn , onlyAppend, refreshAll, myFunction*/
    if (a.refreshArea === undefined) a.refreshArea = "div1";
    if (a.ctrlAction === undefined) a.ctrlAction = "GetData";
    if (a.confirm === undefined) a.confirm = "false";
    if (a.event === undefined) a.event = "show";  /*update | insert | remove | show */
    if (a.edid === undefined) a.edid = 0;
    if (a.ctrl === undefined) a.ctrl = window.location.pathname.split('/')[1];
    //if (a.func === undefined) a.func = null;
    if (a.closefunc === undefined) a.closefunc = function (r) { };
    if (a.title === undefined) a.title = "Edit Area";
    if (a.tsk === undefined) a.tsk = "lst"; /*//lst //frm // dsp // rem // ref //*/
    if (a.popUp === undefined) a.popUp = "false";

    if (a.showLoader === 'true') { LoaderAppend(a.refreshArea); }
    if (a.popUpStyle === undefined) a.popUpStyle = "";
    if (a.popUpSize === undefined) a.popUpSize = "lg";
    if (a.divId === undefined) a.divId = a.refreshArea + "-" + a.edid;
    if (a.showMsg === undefined) a.showMsg = 'true';


    if (a.ctrl.length === 0) a.ctrl = "Home";


    var f = new FormData();
    if (a.tsk !== undefined) f.append("sect", a.tsk);
    if (a.refreshArea !== undefined) f.append("refreshArea", a.refreshArea);
    if (a.returnAction !== undefined) f.append("returnAction", a.returnAction);

    f.append("edid", a.edid);
    if (a.frmName !== undefined) {
        $('input[type=file]').each(function () {
            var inputfile = $(this);
            var files = inputfile[0].files;
            for (var fi = 0; fi < files.length; fi++) {
                f.append(inputfile[0].name, files[fi], files[fi].name);
            }

        });

        var elements = document.forms[a.frmName].elements;
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].name.length !== 0) {
                if (elements[i].type === "radio" || elements[i].type === "checkbox") {
                    if (elements[i].checked === true)
                        f.append(elements[i].name, elements[i].value);
                } else f.append(elements[i].name, elements[i].value);

            }
        }
    }
    if (a.frmValues !== undefined) {
        var attrib = a.frmValues;
        Object.keys(attrib).forEach(function (key) { f.append(key, attrib[key]); });
    }

    if (a.leavePopUpOpen === 'false') KillPopUp();

    if (a.confirm === 'true') {
        if (a.confirmArr === undefined) a.confirmArr = {};
        if (a.confirmArr.title === undefined) a.confirmArr.title = "Are you sure?";
        if (a.confirmArr.text === undefined) a.confirmArr.text = " ";
        if (a.confirmArr.type === undefined) a.confirmArr.type = "warning";
        if (a.confirmArr.confirmButtonClass === undefined) a.confirmArr.confirmButtonClass = "btn-danger";
        if (a.confirmArr.confirmButtonText === undefined) a.confirmArr.confirmButtonText = "Yes, I am!";
        if (a.confirmArr.showCancelButton === undefined) a.confirmArr.showCancelButton = 'true';
        if (a.confirmArr.closeOnConfirm === undefined) a.confirmArr.closeOnConfirm = 'true';

        swal({
                type: "warning",
                confirmButtonClass: "btn-danger",
                title: a.confirmArr.title,
                text: a.confirmArr.text,
                confirmButtonText: a.confirmArr.confirmButtonText,
                showCancelButton: true,
                closeOnConfirm: true

                /*,showLoaderOnConfirm: true*/
            },
            function (isConfirm) {
                if (isConfirm) {
                    window.onkeydown = null;
                    window.onfocus = null;
                    jPakAJx("/" + a.ctrl + "/" + a.ctrlAction, f, function (r) {
                        jPakSuccessFunc(a, r);
                        if (a.func !== undefined) {
                            a.func(r);
                        }
                        return true;
                    });
                } else {
                    swal("Cancelled", "You are safe :)", "info");
                }
            });

    } else {

        if (a.popUp === 'true') {
            jPakCrtMdl({ modalHeader: a.title, divId: a.divId, style: a.popUpStyle, sizeModal: a.popUpSize });
            $(document).on('click', "#swalClose1", function (r) { a.closefunc(r); });
            $(document).on('click', "#swalClose2", function (r) { a.closefunc(r); });
            a.refreshArea = a.divId;
        }

        jPakAJx("/" + a.ctrl + "/" + a.ctrlAction, f, function (r) { jPakSuccessFunc(a, r); if (a.func !== undefined) a.func(r); });

    }

    return false;
}
function jPakCrtMdl(a) {

    var divId = "PopUp";
    var sizeModal = "lg";
    var modalHeader = "General Information";
    var style = 'style="width:75%;"';
    if (a.divId !== undefined) divId = a.divId;
    if (a.sizeModal !== undefined) sizeModal = a.sizeModal;
    if (a.style !== undefined) style = a.style;
    if (a.modalHeader !== undefined) modalHeader = a.modalHeader;

    if (document.getElementById(divId) === null) {
        var div = '<div class="modal fade" id="' + divId + '">';
        var sizeModeldiv = '<div class="modal-dialog modal-' + sizeModal + '" style="' + style + '" >';
        var container = '<div class="modal-content">';
        var header = '<div class="modal-header"><button type="button" id="swalClose1" class="close swalClose" data-dismiss="modal" style="color: #000;">&times;</button><h4 class="modal-title">' + modalHeader + '</h4></div>';
        var body = '<div class="modal-body" id="modal-body" ></div>';
        var footer = '<div class="modal-footer"><button type="button" id="swalClose2" class="btn swalClose btn-default" data-dismiss="modal">Close</button></div>';
        container = container + header + body + footer + '</div>';
        sizeModeldiv = sizeModeldiv + container + '</div>';
        div = div + sizeModeldiv + '</div>';

        $('body').prepend(div);
        $('.modal-body').append('<div class="Preloader" id="Preloader" style="display:none"></div>');
        LoaderAppend("Preloader");
        ProgressAppend("Preloader");
        $('#' + divId).modal();

        $('#' + divId).on('shown.bs.modal', function () {
            $(document).off('focusin.modal');
        });


    }
}
function jPakAJx(url, data, success) {
    var type = "POST";
    if (data.length !== 0) {
        $.ajax({
            url: url,
            type: type,
            cache: false,
            contentType: false, // Not to set any content header
            processData: false, // Not to process data
            data: data,
            timeout: 30000,
            async: false,
            success: success,
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);
                        /*$('.myprogress').text(percentComplete + '%');*/
                        $('.myprogress').css('width', percentComplete + '%');
                    }
                }, false);
                return xhr;
            },
            error: function (r) { /*swal("Oops!", "Some thing went wrong!", "warning");*/ }
        });
    } else {
        $.ajax({
            url: url,
            type: type,
            cache: false,
            timeout: 30000,
            async: false,
            contentType: false,
            processData: false,
            success: success,
            error: function (r) { /*swal("Oop!", "Some thing went wrong!", "warning");*/ }
        });
    }
}
function jPakSuccessFunc(a, r) {


    var row = document.getElementById('trc-' + a.edid);
    var rowC = $('.trc-' + a.edid);

    if (a.event === "remove") {
        if (row !== null) $('#trc-' + a.edid).remove();
        if (rowC !== null) $('.trc-' + a.edid).remove();
        if (a.showMsg === 'true') toastr.warning("Done");
        return false;
    }

    if (a.frmName !== undefined) {
        if (r.ReturnAction === "onlyPrepend") $('#' + r.RefreshArea).prepend(r.Data);
        else if (r.ReturnAction === "onlyAppend") $('#' + r.RefreshArea).append(r.Data);
        else if (r.ReturnAction === "refreshAll") $('#' + r.RefreshArea).empty().append(r.Data);
        if (a.showMsg === 'true' && (r.ErrorMessage !== undefined)) toastr.warning(r.ErrorMessage);
        if (document.forms[a.frmName] !== undefined) document.forms[a.frmName].reset();
    }

    if (a.returnAction === "refreshAll") {
        if (a.popUp === 'true') {
            $("#" + a.divId).modal('show');
            $('#' + a.divId + ' .modal-body').empty().html(r);
        } else
            $('#' + a.refreshArea).empty().append(r);
    }
    else if (a.returnAction === "onlyAppend") $('#' + a.refreshArea).append(r);
    else if (a.returnAction === "onlyPrepend") $('#' + a.refreshArea).prepend(r);
    else if (a.returnAction === "noReturn") {
        if (a.showMsg === 'true') toastr.warning("Done");
    }
    //else if (a.returnAction === "myFunc") a.func(r);
    else if (a.returnAction === "remoteFeed") {
        $.each(r,
            function (index, value) {

                if (value.ReturnAction === "onlyAppend")
                    $('#' + value.RefreshArea).append(value.Data);
                else if (value.ReturnAction === "onlyPrepend")
                    $('#' + value.RefreshArea).append(value.Data);
                else
                    $('#' + value.RefreshArea).empty().append(value.Data);
            });
    } else {
        if (a.showMsg === 'true') toastr.warning("Done");
    }
}
