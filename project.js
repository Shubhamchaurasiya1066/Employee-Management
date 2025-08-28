$(document).ready(function () {
    $.getJSON('/employee/fetch_all_states', function (response) {
        //alert(JSON.stringify(response.data))
        response.data.map((item) => {
            $('#state_id').append($('<option>').text(item.state_name).val(item.state_id))
        })
    })
    $('#state_id').change(function () {
        $.getJSON('/employee/fetch_all_city', { state_id: $('#state_id').val() }, function (response) {
            $('#city_id').empty()
            $('#city_id').append($('<option>').text('Select City'))

            response.data.map((item) => {
                $('#city_id').append($('<option>').text(item.city_name).val(item.city_id))
            })
        })
    })
    $('#picture').change(function (event) {
        var file = URL.createObjectURL(event.target.files[0])
        $('#epic').attr('src', file)
    })

})