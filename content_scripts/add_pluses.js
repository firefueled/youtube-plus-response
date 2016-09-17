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
            // this mutation should be (hopefuly) ignored, since it was caused by something on YouTube Plus Filter
            if (mutation.addedNodes.length == 1 && ytpf_blocker) {
              ytpf_blocker == false;
              return
            }
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

// listens for the loading of a different video, triggering it's comment section listener
function watchVideoChanges() {
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {

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

// add plus buttons to comments
function addPluses(node = document) {

  var commentFooters = node.getElementsByClassName('comment-renderer-footer')
 
  for (let footer of commentFooters) {
    plusBtn = newPlusButton()

    commentMenu = footer.querySelector('.comment-renderer-action-menu')
    footer.insertBefore(plusBtn, commentMenu)
  }
}

// creates a new plus button element
function newPlusButton() {
  let plusBtn = document.createElement('button')
  let plusImg = document.createElement('img')
  let plusUrl = chrome.extension.getURL('images/ic_plus_one_17dp.png')

  plusImg.setAttribute('src', plusUrl)
  plusImg.setAttribute('class', 'comment-action-buttons-plusreponse-img')
  plusBtn.setAttribute('class', 'sprite-comment-actions comment-action-buttons-plusreponse-btn')
  plusBtn.appendChild(plusImg)

  plusBtn.addEventListener('click', function() {

    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
      
        if (mutation.type === 'childList' && mutation.addedNodes.length != 0) {
          mutation.target.querySelector('.comment-simplebox-text').innerHTML = '+'
          let replyBtn = mutation.target.querySelector('.comment-simplebox-submit')

          replyBtn.disabled = false // i may need to simulate a keyboard event instead of doing this
          ytpf_blocker = true // stops the YouTube Plus Filter extension from triggering another addPluses pass when hiding my reply

          replyBtn.click()
        }
      })    
    })

    observer.observe(this.parentElement.lastChild, { childList: true })

    this.parentElement.children[0].click()
  })

  return plusBtn
}

// watches for comment section load on first site loading and refreshes
watchCommentSectionLoad()
// watches for page re-renderings when a different video is loaded
watchVideoChanges()

