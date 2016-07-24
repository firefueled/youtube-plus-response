//var plus_btn = document.createElement('button')
//var plus_text = document.createTextNode('+')
//
//plus_btn.appendChild(plus_text)
//
//var comment_footers = document.getElementsByClassName('comment-renderer-footer')
//for (footer in comment_footers) {
//  alert(footer)
//  break
//}

function doIt() {

  var comment_footers = document.getElementsByClassName('comment-renderer-footer')
  var observerConfig = { childList: true };
 
  for (let footer of comment_footers) {
    let plus_text = document.createTextNode('+')
    let plus_btn = document.createElement('button')
    plus_btn.appendChild(plus_text)

    plus_btn.addEventListener('click', function() {

      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList') {
            mutation.target.querySelector('.comment-simplebox-text').innerHTML = '+'
            replyBtn = mutation.target.querySelector('.comment-simplebox-submit')
            replyBtn.click()
          }
        })    
      })

      observer.observe(this.parentElement.lastChild, observerConfig)

      this.parentElement.children[0].click()
    })

    footer.insertBefore(plus_btn, footer.children[5])
  }
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");
    if (request.action == "doit")
      doIt()
  }
);
