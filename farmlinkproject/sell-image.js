// sell-image.js - lets sellers upload a photo instead of pasting an image URL.
// The photo is resized in the browser and written into the existing #pImage / #lImage
// input as a data: URL, so sell.js keeps reading the same field and needs no changes.
(function () {
  var MAX_SIDE = 900;      // longest side in px after resizing
  var QUALITY = 0.8;       // JPEG quality
  var MAX_FILE_MB = 8;     // reject huge originals

  function resize(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onerror = function () { reject(new Error('Could not read that file.')); };
      reader.onload = function () {
        var img = new Image();
        img.onerror = function () { reject(new Error('That file is not a valid image.')); };
        img.onload = function () {
          var scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
          var w = Math.round(img.width * scale), h = Math.round(img.height * scale);
          var canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          var ctx = canvas.getContext('2d');
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', QUALITY));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function setup(wrap) {
    var id = wrap.getAttribute('data-img-field');
    var urlInput = document.getElementById(id);
    var fileInput = document.getElementById(id + 'File');
    var preview = wrap.querySelector('.img-preview');
    var previewImg = preview.querySelector('img');
    var removeBtn = preview.querySelector('button');
    var errBox = wrap.querySelector('.img-error');
    var uploadBtn = wrap.querySelector('.img-upload-btn');
    var orText = wrap.querySelector('.img-or');

    function showPreview(src) {
      previewImg.src = src;
      preview.classList.add('show');
      urlInput.style.display = 'none';
      orText.style.display = 'none';
    }
    function clearAll() {
      urlInput.value = '';
      fileInput.value = '';
      previewImg.removeAttribute('src');
      preview.classList.remove('show');
      urlInput.style.display = '';
      orText.style.display = '';
      errBox.textContent = '';
    }

    fileInput.addEventListener('change', function () {
      errBox.textContent = '';
      var file = fileInput.files && fileInput.files[0];
      if (!file) return;
      if (!/^image\//.test(file.type)) { errBox.textContent = 'Please choose an image file.'; fileInput.value = ''; return; }
      if (file.size > MAX_FILE_MB * 1024 * 1024) { errBox.textContent = 'Image is too large (max ' + MAX_FILE_MB + ' MB).'; fileInput.value = ''; return; }
      resize(file).then(function (dataUrl) {
        urlInput.value = dataUrl;      // sell.js reads this field
        showPreview(dataUrl);
      }).catch(function (e) { errBox.textContent = e.message; fileInput.value = ''; });
    });

    removeBtn.addEventListener('click', clearAll);

    // Pasting a URL shows a preview too
    urlInput.addEventListener('change', function () {
      var v = urlInput.value.trim();
      if (/^https?:\/\//i.test(v)) { previewImg.src = v; preview.classList.add('show'); }
      else { preview.classList.remove('show'); }
    });

    // Reset after a successful submit (sell.js calls form.reset())
    var form = wrap.closest('form');
    if (form) form.addEventListener('reset', function () { setTimeout(clearAll, 0); });
  }

  document.querySelectorAll('[data-img-field]').forEach(setup);
})();
