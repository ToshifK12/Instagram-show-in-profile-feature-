// Show in Profile: clickable prototype (no dependencies).
// State is one object; render() redraws the phone from it.

const TARGET = 10; // index of the reel the viewer is watching (Part 1)
const NEXT = 9;    // newer post right before it in the grid (Part 2)

const POSTS = [
  ['RAG in 60 seconds', '18.2K'], ['Sliding window trick', '41.7K'], ['My desk setup', '9,880'],
  ['Two Sum, 3 ways', '22.5K'], ['Big O cheat sheet', '7,304'], ['Next.js + Supabase app', '63.1K'],
  ['Stacks vs queues', '15.9K'], ['Two pointers explained', '128K'], ['Q&A: new grad prep', '5,412'],
  ['The locked door', '88.4K', 'Part 2'], ['The locked door', '212K', 'Part 1'], ['Hash maps in 1 min', '31.0K'],
  ['Day in my CS life', '12.6K'], ['Recursion visualized', '47.3K'], ['Campus tour', '6,021'],
  ['Linked list reversal', '19.8K'], ['Prompting tips', '24.4K'], ['BFS vs DFS', '11.2K'],
  ['Resume tips', '8,765'], ['Why I code', '16.3K'], ['My first video', '2,190'],
].map(([title, views, part], i) => ({
  i, title, views, part: part || '',
  bg: i === TARGET ? '#6B3A22' : i === NEXT ? '#7A4A1E'
    : ['#5A3B2E', '#2E4A3B', '#3B3F5A', '#5A4F2E', '#4A2E3F', '#2E4A55', '#55402E'][i % 7],
}));

const HIGHLIGHTS = [['LeetCode', '#6B3A22'], ['Projects', '#7A4A1E'], ['AI', '#2E4A3B'], ['Campus', '#3B3F5A'], ['Q&A', '#4A2E3F']];

const state = { screen: 'feed', playing: POSTS[TARGET], toast: true };
const phone = document.getElementById('phone');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const icon = (d, size = 26, extra = '') =>
  `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;

const I = {
  back: '<path d="M15 18l-6-6 6-6"/>',
  heart: '<path d="M12 20.5s-8-4.9-8-11A4.5 4.5 0 0 1 12 6.6 4.5 4.5 0 0 1 20 9.500c0 6.1-8 11-8 11z"/>',
  comment: '<path d="M20.5 12a8.5 8.5 0 0 1-12.3 7.6L3.5 20.5l1-4.4A8.5 8.5 0 1 1 20.500 12z"/>',
  share: '<path d="M21 3L10 14"/><path d="M21 3l-6.5 18-4.5-7-7-4.5z"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  music: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  pin: '<circle cx="12" cy="10" r="3"/><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  home: '<path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  plus: '<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 8v8M8 12h8"/>',
  reels: '<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M10 9l5 3-5 3z"/>',
  tagged: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M6.5 19c1.200-2.500 3.200-3.800 5.500-3.800s4.300 1.300 5.500 3.800"/>',
};

function reelView() {
  const p = state.playing;
  const fromProfile = state.screen === 'reel';
  const caption = p.i === TARGET
    ? 'I found a locked door in my dorm... Part 2 is on my profile!'
    : `${p.title}${p.part ? ', ' + p.part : ''}. More in the comments.`;
  return `
  <div class="screen">
    <div class="video" style="background:${p.bg}">
      <h2>${esc(p.title)}</h2>${p.part ? `<div class="part">${p.part}</div>` : ''}
    </div>
    <div class="shade-top"></div><div class="shade-bot"></div>
    <div class="reel-top">
      <div class="title">
        ${fromProfile ? `<button class="icon-btn" data-act="profile-back" aria-label="Back to profile" style="margin-left:-12px">${icon(I.back)}</button>` : ''}
        Reels
      </div>
    </div>
    <div class="rail">
      <div><button class="icon-btn" aria-label="Like">${icon(I.heart, 28)}</button>${p.views}</div>
      <div><button class="icon-btn" aria-label="Comments">${icon(I.comment, 27)}</button>412</div>
      <div><button class="icon-btn" aria-label="Share">${icon(I.share)}</button>2,031</div>
    </div>
    <div class="meta">
      <div class="who"><div class="avatar"></div>toshif.codes<span class="follow-chip">Follow</span></div>
      <div class="caption">${esc(caption)}</div>
      <div class="audio">${icon(I.music, 14)} toshif.codes · Original audio</div>
      <button class="sip" data-act="show-in-profile">${icon(I.grid, 18)} Show in profile</button>
    </div>
  </div>`;
}

function profileView() {
  const watching = state.playing.i;
  // Part 2 = the next newer post, when it belongs to the same series.
  const cur = POSTS[watching];
  const nextIdx = watching > 0 && cur.part && POSTS[watching - 1].title === cur.title ? watching - 1 : -1;
  const tiles = POSTS.map((p) => {
    const cls = p.i === watching ? 'target' : p.i === nextIdx ? 'next' : '';
    const tag = p.i === watching ? 'Watching' : p.i === nextIdx ? p.part : '';
    const label = `Play ${p.title}${p.part ? ', ' + p.part : ''}`;
    return `<button class="tile ${cls}" style="background:${p.bg}" data-act="open" data-i="${p.i}" aria-label="${esc(label)}">
      ${tag ? `<span class="tag">${tag}</span>` : ''}
      <span class="t">${esc(p.title)}${p.part ? ', ' + p.part : ''}</span>
      <span class="v"><svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M7 4l13 8-13 8z"/></svg>${p.views}</span>
    </button>`;
  }).join('');
  return `
  <div class="screen profile">
    <div class="p-top">
      <div class="name"><button class="icon-btn" data-act="feed" aria-label="Back to Reels">${icon(I.back)}</button>toshif.codes</div>
    </div>
    <div class="scroller" id="scroller">
      <div class="head">
        <div class="big-avatar"><i></i></div>
        <div class="stats"><div><b>21</b>posts</div><div><b>48.2K</b>followers</div><div><b>312</b>following</div></div>
      </div>
      <div class="bio"><b>Toshif Khan</b><div class="role">Student</div>CS @ Minot State · Class of 2027<br>LeetCode and AI projects, explained in 60 seconds.</div>
      <div class="actions"><button class="primary">Follow</button><button>Message</button></div>
      <div class="highlights">${HIGHLIGHTS.map(([l, c]) => `<div><span><i style="background:${c}"></i></span>${esc(l)}</div>`).join('')}</div>
      <div class="tabs"><div class="on">${icon(I.grid, 22)}</div><div>${icon(I.reels, 22)}</div><div>${icon(I.tagged, 22)}</div></div>
      <div class="grid">${tiles}</div>
    </div>
    ${state.toast ? `<div class="toast" role="status">${icon(I.pin, 18, 'style="color:#8fb2ff"')}<span>Jumped to the reel you were watching.${nextIdx >= 0 ? ' Part 2 is right next to it.' : ''}</span>
      <button class="icon-btn" data-act="toast" aria-label="Dismiss" style="width:32px;height:32px;color:#a8a8a8">${icon(I.close, 16)}</button></div>` : ''}
  </div>`;
}

function nav() {
  return `<div class="nav">
    <button class="icon-btn" aria-label="Home">${icon(I.home, 25)}</button>
    <button class="icon-btn" aria-label="Search">${icon(I.search, 25)}</button>
    <button class="icon-btn" aria-label="Create">${icon(I.plus, 25)}</button>
    <button class="icon-btn" data-act="feed" aria-label="Reels">${icon(I.reels, 25)}</button>
    <button class="icon-btn" aria-label="Your profile"><span class="me"></span></button>
  </div>`;
}

function render(jump) {
  phone.innerHTML = (state.screen === 'profile' ? profileView() : reelView()) + nav();
  if (state.screen === 'profile') {
    // The core of the feature: land the grid on the reel the viewer came from.
    const scroller = document.getElementById('scroller');
    const target = scroller.querySelector('.tile.target');
    const top = target.offsetTop - scroller.clientHeight / 2 + target.offsetHeight / 2;
    if (jump) scroller.scrollTo({ top, behavior: 'smooth' });
    else scroller.scrollTop = top;
  }
}

phone.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const act = el.dataset.act;
  if (act === 'show-in-profile') { state.screen = 'profile'; state.toast = true; render(true); }
  else if (act === 'open') { state.playing = POSTS[+el.dataset.i]; state.screen = 'reel'; render(); }
  else if (act === 'profile-back') { state.screen = 'profile'; state.toast = false; render(); }
  else if (act === 'feed') { state.playing = POSTS[TARGET]; state.screen = 'feed'; render(); }
  else if (act === 'toast') { state.toast = false; el.closest('.toast').remove(); }
});

render();
