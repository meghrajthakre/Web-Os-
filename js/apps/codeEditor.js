const htmlInput = document.getElementById("html");
const cssInput = document.getElementById("css");
const jsInput = document.getElementById("js");
const previewFrame = document.getElementById("preview");

// Tab switch logic
function switchTab(tab) {
  document.querySelectorAll(".code-tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".editor-toolbar button").forEach(b => b.classList.remove("active"));

  document.getElementById(tab).classList.add("active");
  document.getElementById("tab-" + tab).classList.add("active");
}

// Live preview
function updatePreview() {
  const html = htmlInput.value;
  const css = `<style>${cssInput.value}</style>`;
  const js = `<script>${jsInput.value}<\/script>`;

  const result = html + css + js;
  const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
  doc.open();
  doc.write(result);
  doc.close();
}

// Event listeners
htmlInput.addEventListener("input", updatePreview);
cssInput.addEventListener("input", updatePreview);
jsInput.addEventListener("input", updatePreview);

// Initial preview render
updatePreview();
