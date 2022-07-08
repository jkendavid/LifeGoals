$('.numberonly').on('input', function () {
    var c = this.selectionStart,
        r = /[^0-9]/gi,
        v = $(this).val();
    if (r.test(v)) {
        $(this).val(v.replace(r, ''));
        c--;
    }
    this.setSelectionRange(c, c);
})

$("#inputMonthlyExpeses").on('keyup', function () {
    $('#expeses5years').val(($(this).val() * 60).toLocaleString())
});


//add college schools
var inputEducSchool = $('#inputEducSchool')
$(tuitionFeeList.List).each(function (i, v) {
    inputEducSchool.append(`<option value="${v.Fee}">${v.College}</option>`)
});
inputEducSchool.append(`<option value="Others">Others</option>`)

$('.updateEstimatedTuitionFee').on("change", function () {
    updateEstimatedTuitionFee();
})

var updateEstimatedTuitionFee = function () {
    var birthyear = parseInt($('#inputChildBirthYear').val())
    var school = inputEducSchool.find('option:selected').text()

    if (school == 'Others') {
        $('#inputYearlyTuitionFee').attr('readonly', false);
        $('#inputYearlyTuitionFee').val('')
    }
    else if (birthyear != 0 && school != '') {
        $('#inputYearlyTuitionFee').attr('readonly', true);
        var feebaseyear = dataInt(tuitionFeeList.Year)
        var feeannualincrease = dataInt(tuitionFeeList.AnnualIncrease)

        var startschoolyear = dataInt(birthyear + 18)
        var fee = dataInt(inputEducSchool.val())

        var projectedfee = dataInt(fee * (1 + (startschoolyear - feebaseyear) * feeannualincrease))
        $('#inputYearlyTuitionFee').val(projectedfee.toLocaleString())
    }
}


var updateEducChildTotal = function () {
    var tbl = $('#tblEduc')
    var totalEducFunding = 0
    $(tbl.find('tbody tr')).each(function (i, v) {
        totalEducFunding += dataInt($($(v).find('.educchildtotal')[0]).text())       
    });
    var tfooter = tbl.find('tfoot')
    if (totalEducFunding > 0) {
        tfooter.html(`<td></td><td></td><td></td><td></td><td></td><th>Total</th><th>₱${totalEducFunding.toLocaleString()}</th>`)
    } else {
        tfooter.html('')
    }
}


var removEduc = function (c) {
    c.closest('tr').remove()
    updateEducChildTotal()
}

function dataInt(v) {
    return v == '' ? 0 : parseInt(String(v).replace(/,/g, ""))
}

$("#inputEducAdd").on("click", function () {
    var birthyear = parseInt($('#inputChildBirthYear').val())
    var name = $('#inputEducName').val()
    var school = inputEducSchool.find('option:selected').text()
    if (name != '' && birthyear != 0 && school != '') {

        var projectedfee = dataInt($('#inputYearlyTuitionFee').val())
        var projectedallowance = dataInt($('#inputSchoolAllowance').val())
        var projectedfeetotal = dataInt((projectedfee + (projectedallowance * 209)) * 4 )

        var delbtn = `<button class="btn btn-danger inputEducDelete btn-sm" type="button" onclick="removEduc(this)">x</button>`
        var tblbody = $('#tblEduc tbody')
        tblbody.append(`<tr><td>${delbtn}</td><td>${name}</td><td>${birthyear}</td><td>${school}</td><td>${projectedfee.toLocaleString()}</td><td>${projectedallowance.toLocaleString() }</td><td class="educchildtotal">${projectedfeetotal.toLocaleString()}</td></tr>`);
        $('#inputEducName').val('')
        $('#inputChildBirthYear').val('')
        inputEducSchool.val('')
        $('#inputYearlyTuitionFee').val('')
        $('#inputYearlySchoolAllowance').val('')
        $('#inputEducFormAdd').modal('hide')
        $('#inputYearlyTuitionFee').attr('readonly', true);
        updateEducChildTotal()
    } else {
        alert("Name, Year before college and name of school are required!")
    }
});



$("#dateOfBirth").blur(function () {
    var birthyear = parseInt($(this).val().split("-")[0])
    var currentYear = parseInt(new Date().getFullYear())
    var age = currentYear - birthyear
    $('#outputCurrentAge').val(age)
    updateYearsBeforeRetirement()
})

$("#inputRetirementAge").on("change", function () {
    updateYearsBeforeRetirement()
})

var updateYearsBeforeRetirement = function () {
    var age = parseInt($('#outputCurrentAge').val())
    var retirementAge = parseInt($('#inputRetirementAge').val())
    $('#outputYearRetirement').val(retirementAge - age)
}


$(".updateTotalRetirementFund").on("change", function () {
    updateTotalRetirementFund()
})


var updateTotalRetirementFund = function () {
    var monthlyIncome = parseInt($('#inputMonthlyIncome').val())
    var monthlyIncomePercentNeeded = parseInt($('#inputMonthlyIncomePercent').val())
    var retirementYears = parseInt($('#inputRetirementYearsNeeded').val())
    $('#outputTotalRetirementFund').val((monthlyIncome * monthlyIncomePercentNeeded * 12 * retirementYears / 100).toLocaleString())
}



$('.up').on('click', function (e) {
    var wrapper = $(this).closest('.pnlgroup')
    wrapper.insertBefore(wrapper.prev()).hide().show('slow');
    updatePriorityIndex()
})
$('.down').on('click', function (e) {
    var wrapper = $(this).closest('.pnlgroup')
    wrapper.insertAfter(wrapper.next()).hide().show('slow');
    updatePriorityIndex()
})

var updatePriorityIndex = function () {    
    $('#pnlMain .pnlgroup').each(function (i, v) {
        var tag = 'th'
        i += 1
        if (i == 1) {
            tag = 'st'
        } else if (i == 2) {
            tag = 'nd'
        } else if (i == 3) {
            tag = 'rd'
        }
        $($(v).find('.indexlabel')[0]).html(String(i) + tag)
    });
}

updatePriorityIndex();


$('form').css('padding-top', $('#pnlhead').height())
window.onresize = function () {
    $('form').css('padding-top', $('#pnlhead').height())
}