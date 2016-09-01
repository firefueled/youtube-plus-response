// watch the first load of the comment section
function watchCommentSectionLoad() {
  var commentRenderer = document.getElementById('comment-section-renderer')

  // the comment section is ready     
  if (commentRenderer && commentRenderer.attributes.getNamedItem('data-child-tracking').value.length > 0) {
    addPluses()
    watchHiddenReplies()
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
            watchHiddenReplies()
          }
        }
      })
    })

    var commentRendererWrapper = document.getElementById('watch-discussion')
    observer.observe(commentRendererWrapper, observerConfig)
  }
}

// Listens for clicks on the 'view all replies' buttons; adding pluses to the newly displayed comments
function watchHiddenReplies() {
  var showMoreRepliesBtns = document.getElementsByClassName('comment-replies-renderer-expander-down')

  for (let btn of showMoreRepliesBtns) {
    btn.addEventListener('click', function() {

      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          // this should be triggered only when new nodes (the hidden comments) are added
          if (mutation.type === 'childList' && mutation.addedNodes.length != 0) {
            addPluses(btnParent)
          }
        })
      })
      // observe for changes so we can plus'em'up
      var btnParent = btn.parentElement.parentElement.lastElementChild
      observer.observe(btnParent, { childList: true })
    })
  }
}

// add pluses to comments
function addPluses(node = document) {

  var commentFooters = node.getElementsByClassName('comment-renderer-footer')
  var observerConfig = { childList: true };
 
  for (let footer of commentFooters) {
    let shouldCaptureNextMutation = false
    // let didPlusReply = false
    let plusBtn = document.createElement('button')
    let plusImg = document.createElement('img')
    let plusUrl = chrome.extension.getURL('images/ic_plus_one_17dp.png')

    plusImg.setAttribute('src', plusUrl)
    plusImg.setAttribute('class', 'comment-action-buttons-plusreponse-img')
    plusBtn.setAttribute('class', 'sprite-comment-actions comment-action-buttons-plusreponse-btn')
    plusBtn.appendChild(plusImg)

    plusBtn.addEventListener('click', function() {

      // // avoid replying more than once
      // if (didPlusReply == true) {
      //   return
      // }

      var observer = new MutationObserver(function(mutations) {
        // avoids being triggered by the reply box hiding
        if (shouldCaptureNextMutation == false) {
          return
        }
          
        mutations.forEach(function(mutation) {
        
          if (mutation.type === 'childList') {
            mutation.target.querySelector('.comment-simplebox-text').innerHTML = '+'
            replyBtn = mutation.target.querySelector('.comment-simplebox-submit')

            replyBtn.disabled = false // i may need to simulate a keyboard event instead of doing this
            shouldCaptureNextMutation = false // false to stop the reverse triggering of the mutation
            // didPlusReply = true // true to avoid replying more than once

            replyBtn.click()
          }
        })    
      })

      observer.observe(this.parentElement.lastChild, observerConfig)

      shouldCaptureNextMutation = true
      this.parentElement.children[0].click()
    })

    commentMenu = footer.querySelector('.comment-renderer-action-menu')
    footer.insertBefore(plusBtn, commentMenu)
  }
}

function watchVideoChanges() {
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        console.log('#content changed===========')

        // the price you pay for partial loading
        var observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {  
              watchCommentSectionLoad()
            }
          })
        })
        var content = document.querySelector('#watch7-container')
        observer.observe(content, { childList: true })
      }
    })
  })

  var content = document.querySelector('#content')
  observer.observe(content, { childList: true })
}

// watches for comment section load on first site loading and refreshes
watchCommentSectionLoad()
// watches for page re-renderings when a different video is loaded
watchVideoChanges()

