  // mock in-memory data
  let thread = {
    id: 1,
    title: 'Welcome Thread',
    body: 'ยินดีต้อนรับสู่ Mini Forum — ลองคอมเมนต์ได้เลย!',
    author: 'Admin',
    createdAt: new Date(),
    comments: [
      { id:1, author:'Alice', body:'สวัสดีทุกคน!', createdAt: new Date() },
      { id:2, author:'Bob', body:'พร้อมลองระบบครับ', createdAt: new Date() }
    ]
  };

  // render helpers
  const fmt = d => new Intl.DateTimeFormat('th-TH',{hour:'2-digit',minute:'2-digit'}).format(d);
  const el = sel => document.querySelector(sel);

  function renderThread(){
    el('#threadTitle').textContent = thread.title;
    el('#threadBody').textContent  = thread.body;
    el('#threadAuthor').textContent= thread.author;
    el('#threadTime').textContent  = fmt(thread.createdAt);

    // initials for avatar
    const initials = thread.author.trim().slice(0,2).toUpperCase();
    document.querySelector('.thread-card .avatar').textContent = initials;

    renderComments();
  }

  function renderComments(){
    const list = el('#commentList');
    list.innerHTML = '';
    if(thread.comments.length === 0){
      list.innerHTML = '<li class="list-group-item text-center text-muted">ยังไม่มีคอมเมนต์</li>';
      return;
    }
    thread.comments.forEach(c=>{
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-start comment-item';
      li.innerHTML = `
        <div class="me-3">
          <div><span class="fw-semibold">${escapeHtml(c.author)}</span> — ${escapeHtml(c.body)}</div>
          <div class="comment-meta">${fmt(c.createdAt)}</div>
        </div>
        <div class="comment-actions btn-group">
          <button class="btn btn-outline-secondary btn-sm" data-action="edit" data-id="${c.id}">Edit</button>
          <button class="btn btn-outline-danger btn-sm" data-action="delete" data-id="${c.id}">Delete</button>
        </div>
      `;
      list.appendChild(li);
    });
  }

  // add comment
  el('#commentForm').addEventListener('submit', e=>{
    e.preventDefault();
    const fd = new FormData(e.target);
    const author = (fd.get('author')||'').toString().trim();
    const body   = (fd.get('body')||'').toString().trim();
    if(!author || !body) return;

    const maxId = thread.comments.reduce((m,c)=>Math.max(m,c.id),0);
    thread.comments.push({ id:maxId+1, author, body, createdAt:new Date() });
    e.target.reset();
    renderComments();
  });

  // edit/delete comment
  el('#commentList').addEventListener('click', e=>{
    const btn = e.target.closest('button[data-action]');
    if(!btn) return;
    const id = +btn.dataset.id;
    const c  = thread.comments.find(x=>x.id===id);
    if(!c) return;

    if(btn.dataset.action==='edit'){
      const newText = prompt('Edit comment:', c.body);
      if(newText!=null){
        c.body = newText.trim();
        renderComments();
      }
    }else if(btn.dataset.action==='delete'){
      if(confirm('Delete this comment?')){
        thread.comments = thread.comments.filter(x=>x.id!==id);
        renderComments();
      }
    }
  });

  // edit thread (modal)
  const editModal = document.getElementById('editThreadModal');
  editModal.addEventListener('show.bs.modal', ()=>{
    document.getElementById('editTitle').value  = thread.title;
    document.getElementById('editBody').value   = thread.body;
    document.getElementById('editAuthor').value = thread.author;
  });
  document.getElementById('editThreadForm').addEventListener('submit', e=>{
    e.preventDefault();
    thread.title  = document.getElementById('editTitle').value.trim()  || thread.title;
    thread.body   = document.getElementById('editBody').value.trim()   || thread.body;
    thread.author = document.getElementById('editAuthor').value.trim() || thread.author;
    bootstrap.Modal.getInstance(editModal).hide();
    renderThread();
  });

  // delete thread
  document.getElementById('deleteThreadBtn').addEventListener('click', ()=>{
    if(confirm('Delete this thread?')){
      document.getElementById('demo-thread').innerHTML =
        '<div class="alert alert-warning">Thread has been deleted.</div>';
    }
  });

  // util
  function escapeHtml(s){
    const map = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#039;'};
    return s.replace(/[&<>"']/g, m=>map[m]);
  }

  // init
  renderThread();