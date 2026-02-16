/**
 * Web Chấm Công - Dữ liệu và hằng số
 */

// Hệ số lương theo cấp bậc (Hạ sĩ -> Đại tướng) - tham khảo thang lương quân đội
const LUONG_CAP_BAC = [
  { rank: 'Hạ sĩ', heSo: 2.34 },
  { rank: 'Trung sĩ', heSo: 2.67 },
  { rank: 'Thượng sĩ', heSo: 3.00 },
  { rank: 'Thiếu úy', heSo: 3.33 },
  { rank: 'Trung úy', heSo: 3.66 },
  { rank: 'Đại úy', heSo: 4.00 },
  { rank: 'Thiếu tá', heSo: 4.33 },
  { rank: 'Trung tá', heSo: 4.66 },
  { rank: 'Đại tá', heSo: 5.00 },
  { rank: 'Thiếu tướng', heSo: 6.00 },
  { rank: 'Trung tướng', heSo: 6.50 },
  { rank: 'Đại tướng', heSo: 7.00 },
];

const STORAGE_ATTENDANCE = 'webchamcong_attendance';
const STORAGE_ADMIN = 'webchamcong_admin';
const STORAGE_SESSION = 'webchamcong_session';
const STORAGE_CURRENT_DUTY = 'webchamcong_current_duty';

// Mức lương cơ sở (VNĐ) - từ 1/7/2024
const LUONG_CO_SO = 2340000;

function getAttendanceList() {
  try {
    const raw = localStorage.getItem(STORAGE_ATTENDANCE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAttendanceList(list) {
  localStorage.setItem(STORAGE_ATTENDANCE, JSON.stringify(list));
}

function getAdminUser() {
  try {
    const raw = localStorage.getItem(STORAGE_ADMIN);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setAdminUser(user) {
  if (user) {
    localStorage.setItem(STORAGE_ADMIN, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_ADMIN);
  }
}

function getSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setSession(data) {
  if (data) {
    sessionStorage.setItem(STORAGE_SESSION, JSON.stringify(data));
  } else {
    sessionStorage.removeItem(STORAGE_SESSION);
  }
}

function isAdminLoggedIn() {
  return !!getSession();
}

function formatTime(d) {
  if (!d) return '--:--';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(d) {
  if (!d) return '--/--/----';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('vi-VN');
}

function getHeSoByRank(rankName) {
  const found = LUONG_CAP_BAC.find(function (r) {
    return r.rank === rankName;
  });
  return found ? found.heSo : 0;
}

function tinhLuongThang(heSo) {
  return Math.round(LUONG_CO_SO * heSo);
}

function getCurrentDuty() {
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_DUTY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setCurrentDuty(data) {
  if (data) {
    localStorage.setItem(STORAGE_CURRENT_DUTY, JSON.stringify(data));
  } else {
    localStorage.removeItem(STORAGE_CURRENT_DUTY);
  }
}

function toDateTimeLocal(d) {
  var date = typeof d === 'string' ? new Date(d) : d;
  var tz = date.getTimezoneOffset() * 60000;
  var local = new Date(date.getTime() - tz);
  return local.toISOString().slice(0, 16);
}
