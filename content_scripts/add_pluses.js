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

function watchCommentSection() {
  var comment_renderer = document.getElementById('comment-section-renderer')

  // the comment section is ready     
  if (comment_renderer.attributes.getNamedItem('data-child-tracking').value.length > 0) {
    addPluses()
  } else {
    var observerConfig = { childList: true }

    // comment-section observer
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
      
        if (mutation.type === 'childList') {

          // the comment section is ready
          if (mutation.target.firstChild.attributes.getNamedItem('data-child-tracking').value.length > 0) {
            observer.disconnect()
            addPluses()
          }
        }
      })
    })

    var comment_renderer_wrapper = document.getElementById('watch-discussion')
    observer.observe(comment_renderer_wrapper, observerConfig)
  }
}

function addPluses() {

  var comment_footers = document.getElementsByClassName('comment-renderer-footer')
  var observerConfig = { childList: true };
 
  for (let footer of comment_footers) {
    let plus_text = document.createTextNode('+')
    let plus_btn = document.createElement('button')
    
    let should_capture_next_mutation = false
    let did_plus_reply = false
    
    plus_btn.appendChild(plus_text)

    plus_btn.addEventListener('click', function() {

      // avoid replying more than once
      if (did_plus_reply == true) {
        return
      }

      var observer = new MutationObserver(function(mutations) {
        // avoids being triggered by the reply box hiding
        if (should_capture_next_mutation == false) {
          return
        }
          
        mutations.forEach(function(mutation) {
        
          if (mutation.type === 'childList') {
            mutation.target.querySelector('.comment-simplebox-text').innerHTML = '+'
            replyBtn = mutation.target.querySelector('.comment-simplebox-submit')

            replyBtn.disabled = false // i may need to simulate a keyboard event instead of doing this
            should_capture_next_mutation = false // false to stop the reverse triggering of the mutation
            did_plus_reply = true // true to avoid replying more than once

            replyBtn.click()
          }
        })    
      })

      observer.observe(this.parentElement.lastChild, observerConfig)

      should_capture_next_mutation = true
      this.parentElement.children[0].click()
    })

    footer.insertBefore(plus_btn, footer.children[5])
  }
}

watchCommentSection()
