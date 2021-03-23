function confirmMsg(){
    var confirmText = window.document.getElementById('msg')
    var askConfirm = window.confirm(confirmText.value)
    var confirmed = window.document.getElementById('confirmed')
    confirmed.value = askConfirm
    document.forms["confirm"].submit()
}