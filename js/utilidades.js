(function () {
  'use strict';
  window.AjedrezUI = {
    escape: function (value) { return String(value ?? '').replace(/[&<>'"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[c]; }); },
    query: function (selector, root) { return (root || document).querySelector(selector); },
    queryAll: function (selector, root) { return Array.from((root || document).querySelectorAll(selector)); },
    tags: function (items) { return (items || []).map(function (item) { return '<span class="tag">' + AjedrezUI.escape(item) + '</span>'; }).join(' '); },
    setMeta: function (title, description) { document.title = title; var meta = document.querySelector('meta[name="description"]'); if (meta) meta.content = description; },
    initialsColor: function (initials) { var colors = ['#203a53', '#73551a', '#315b68', '#4b385f']; return colors[(initials || '').charCodeAt(0) % colors.length]; }
  };
}());
