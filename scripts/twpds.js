export function playVideo() {
  document.getElementById('placeholder').classList.add('hidden');
  const $video=document.getElementById('video');
  $video.classList.remove('hidden');
  $video.play();
}

function decorateVideoSections() {

      // videos
      document.querySelectorAll('main a[href^="https://images-tv.adobe.com/"]').forEach(($vlink) => {
          const $videoDiv=$vlink.closest('div');
          const href=$vlink.getAttribute('href');
          const imgSrc=$videoDiv.querySelector('img').getAttribute('src');
          $videoDiv.classList.add('video-section');
  
          const $videoText=createTag('div', {class: 'video-text'});
  
          Array.from($videoDiv.children).forEach(($e) => {
              if (!$e.querySelector('img')) {
                  $videoText.append($e);
              }
          });
  
          $videoDiv.innerHTML=`<div class="video"><div id="placeholder" class="button">
          <svg xmlns="http://www.w3.org/2000/svg"><use href="/static/twp3/icons/play.svg#icon"></use></svg>
          </div>
          <video id='video' class="hidden" preload="metadata" src="${href}" tabindex="0">
          <source src="${href}" type="video/mpeg4">
          </video></div>`;
          $videoDiv.append($videoText);
  
          $videoDiv.firstChild.firstChild.style.backgroundImage=`url(${imgSrc})`;
          $videoDiv.firstChild.addEventListener('click', (e) => playVideo());
          
      })    
}

async function insertSteps() {
  const $steps=document.querySelector('main div.steps');
  if ($steps) {
      let i=1;
      let done=false;
      let html='';
      do {
        const url=`step-${i}.plain.html`;
        window.hlx.dependencies.push(url);
        const resp=await fetch (url);
        if (resp.status == 200) {
              const text=await resp.text();
              const $html=createTag('div');
              $html.innerHTML=text; 
              const $h1=$html.querySelector('h1');
              const title=$h1?$h1.innerHTML:'';
              let desc='';
              if (title) {
                  const $p=$h1.nextElementSibling;
                  if ($p) desc=$p.innerHTML;
              }
              const $h4=$html.querySelector('h4');
              const duration=$h4?$h4.innerHTML.split('|')[1]:'';
              const $ul=$html.querySelector('div:first-of-type ul');
              const greatfor=$ul?$ul.innerHTML:'';
              const $img=$html.querySelector('img');
              const src=$img?$img.getAttribute('src'):'';

              html+=`<div class="card" onclick="window.location='step-${i}'">
              <div class="card-header">
                  <span class="card-duration">${duration} | Great for</span>
                  <div class="card-greatfor"><ul>${greatfor}</ul></div>
              </div>
              <div class="card-img" style="background-image: url(${src})">
              <svg xmlns="http://www.w3.org/2000/svg"><use href="/static/twp3/icons/play.svg#icon"></use></svg>
              </div>
              <div class="card-text">
                  <div><h4>${title}</h4>
                  <p>${desc}</p>
                  </div>
                  <a href="step-${i}">Watch now</a>
              </div>
              </div>`

          } else {
              done=true;
          }
          i++;

      } while (!done);

      $steps.innerHTML=html;
  }
}

async function decoratePage() {
  addDefaultClass('main>div');

  await loadLocalHeader();

  // heading
  classify ('main>div:nth-of-type(1)', 'header');
  classify ('main>.header ul', 'roles');

  classify ('main h3', 'gray', 1)

  decorateVideoSections();

  document.querySelectorAll('main p').forEach(($e) => {
    const inner=$e.innerHTML.toLowerCase().trim();
    if (inner == "&lt;steps&gt;" || inner == '\\<steps></steps>') {
          $e.parentNode.classList.add('steps');
          $e.parentNode.classList.remove('default');
          $e.parentNode.innerHTML='';
      }
  })

  await insertSteps();

  window.pages.decorated = true;
  appearMain();

}

if (document.readyState == 'loading') {
  window.addEventListener('DOMContentLoaded', (event) => {
      decoratePage();
  });
} else {
  decoratePage();
}