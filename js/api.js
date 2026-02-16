/**
 * API layer - ưu tiên Firebase, sau đó server Node, cuối cùng localStorage.
 */
(function () {
  function apiBase() { return ''; }

  function useServer() {
    return typeof window !== 'undefined' && (window.location.protocol === 'http:' || window.location.protocol === 'https:');
  }

  function useFirebase() {
    return typeof window.useFirebase === 'function' && window.useFirebase();
  }

  function getToken() {
    if (useFirebase()) {
      try { return (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) ? firebase.auth().currentUser.uid : null; } catch (e) { return null; }
    }
    try { return sessionStorage.getItem('webchamcong_token'); } catch (e) { return null; }
  }

  function setToken(token) {
    if (useFirebase()) return;
    if (token) sessionStorage.setItem('webchamcong_token', token);
    else sessionStorage.removeItem('webchamcong_token');
  }

  window.useServer = useServer;
  window.getToken = getToken;
  window.setToken = setToken;

  window.isAdminLoggedIn = function () {
    if (useFirebase()) return !!getToken();
    if (useServer()) return !!getToken();
    try { return !!getSession(); } catch (e) { return false; }
  };

  function fetchJson(url, options) {
    options = options || {};
    var headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
    var token = getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;
    return fetch(apiBase() + url, Object.assign({}, options, { headers: headers }))
      .then(function (res) {
        if (!res.ok) return res.json().then(function (data) { throw new Error(data.error || res.statusText); });
        return res.json();
      });
  }

  window.apiGetAttendance = function (approvedOnly) {
    if (useFirebase()) return window.firebaseGetAttendance(approvedOnly);
    if (!useServer()) return Promise.resolve(null);
    var url = '/api/attendance' + (approvedOnly ? '' : '?all=1');
    return fetchJson(url);
  };

  window.apiAddAttendance = function (item) {
    if (useFirebase()) return window.firebaseAddAttendance(item);
    if (!useServer()) return Promise.resolve(null);
    return fetchJson('/api/attendance', {
      method: 'POST',
      body: JSON.stringify({ hoTen: item.hoTen, capBac: item.capBac, gioVao: item.gioVao, gioRa: item.gioRa, ghiChu: item.ghiChu || '' })
    });
  };

  window.apiUpdateAttendance = function (id, data) {
    if (useFirebase()) return window.firebaseUpdateAttendance(id, data);
    if (!useServer()) return Promise.resolve(null);
    return fetchJson('/api/attendance/' + encodeURIComponent(id), { method: 'PUT', body: JSON.stringify(data) });
  };

  window.apiLogin = function (username, password) {
    if (useFirebase()) return window.firebaseLogin(username, password);
    if (!useServer()) return Promise.resolve(null);
    return fetchJson('/api/auth/login', { method: 'POST', body: JSON.stringify({ username: username, password: password }) });
  };

  window.apiMe = function () {
    if (useFirebase()) return window.firebaseCurrentUser();
    if (!useServer()) return Promise.resolve(null);
    return fetchJson('/api/auth/me');
  };

  window.apiLogout = function () {
    if (useFirebase()) return window.firebaseLogout();
    setToken(null);
    setSession(null);
    return Promise.resolve();
  };

  window.apiChangePassword = function (currentPassword, newPassword) {
    if (useFirebase()) return window.firebaseChangePassword(currentPassword, newPassword);
    if (!useServer()) return Promise.resolve(null);
    return fetchJson('/api/admin/password', { method: 'PUT', body: JSON.stringify({ currentPassword: currentPassword, newPassword: newPassword }) });
  };
})();
