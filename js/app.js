/**
 * Web Chấm Công - Logic chung
 */

(function () {
  function renderSalaryTable(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    let html = '<table class="data-table salary-table"><thead><tr><th>Cấp bậc</th><th>Hệ số lương</th><th>Lương tháng (VNĐ)</th></tr></thead><tbody>';
    LUONG_CAP_BAC.forEach(function (r) {
      const luong = tinhLuongThang(r.heSo);
      html += '<tr><td>' + escapeHtml(r.rank) + '</td><td>' + r.heSo + '</td><td>' + formatNumber(luong) + '</td></tr>';
    });
    html += '</tbody></table>';
    el.innerHTML = html;
  }

  function escapeHtml(s) {
    if (s == null) return '';
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function formatNumber(n) {
    return new Intl.NumberFormat('vi-VN').format(n);
  }

  window.renderSalaryTable = renderSalaryTable;
  window.escapeHtml = escapeHtml;
  window.formatNumber = formatNumber;
})();
