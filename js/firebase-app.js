/**
 * Firebase App - Firestore (chấm công) + Auth (admin).
 * Load sau firebase-config.js và SDK (compat).
 */
(function () {
  if (typeof firebase === 'undefined' || typeof FIREBASE_CONFIG === 'undefined' || !FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey === 'YOUR_API_KEY') {
    window.useFirebase = function () { return false; };
    return;
  }

  var app = firebase.initializeApp(FIREBASE_CONFIG);
  var db = firebase.firestore(app);
  var auth = firebase.auth(app);
  var COLLECTION = 'attendance';

  window.useFirebase = function () { return true; };

  function docToItem(doc) {
    var d = doc.data();
    return {
      id: doc.id,
      hoTen: d.hoTen || '',
      capBac: d.capBac || '',
      gioVao: d.gioVao || '',
      gioRa: d.gioRa || '',
      ghiChu: d.ghiChu || '',
      status: d.status || 'pending',
      createdAt: d.createdAt || '',
      updatedAt: d.updatedAt || ''
    };
  }

  window.firebaseGetAttendance = function (approvedOnly) {
    var ref = db.collection(COLLECTION);
    var q = approvedOnly ? ref.where('status', '==', 'approved') : ref.orderBy('createdAt', 'desc');
    return q.get().then(function (snap) {
      var list = [];
      snap.forEach(function (doc) { list.push(docToItem(doc)); });
      return list;
    });
  };

  window.firebaseAddAttendance = function (item) {
    var now = new Date().toISOString();
    var data = {
      hoTen: item.hoTen,
      capBac: item.capBac,
      gioVao: item.gioVao,
      gioRa: item.gioRa,
      ghiChu: item.ghiChu || '',
      status: 'pending',
      createdAt: now,
      updatedAt: now
    };
    return db.collection(COLLECTION).add(data).then(function (docRef) {
      var out = { id: docRef.id };
      for (var k in data) { if (data.hasOwnProperty(k)) out[k] = data[k]; }
      return out;
    });
  };

  window.firebaseUpdateAttendance = function (id, data) {
    var update = { updatedAt: new Date().toISOString() };
    if (data.status !== undefined) update.status = data.status;
    if (data.hoTen !== undefined) update.hoTen = data.hoTen;
    if (data.capBac !== undefined) update.capBac = data.capBac;
    if (data.gioVao !== undefined) update.gioVao = data.gioVao;
    if (data.gioRa !== undefined) update.gioRa = data.gioRa;
    if (data.ghiChu !== undefined) update.ghiChu = data.ghiChu;
    return db.collection(COLLECTION).doc(id).update(update).then(function () { return update; });
  };

  window.firebaseLogin = function (email, password) {
    return auth.signInWithEmailAndPassword(email, password).then(function (userCred) {
      return { token: userCred.user.uid, username: userCred.user.email };
    });
  };

  window.firebaseLogout = function () {
    return auth.signOut();
  };

  window.firebaseCurrentUser = function () {
    var u = auth.currentUser;
    return u ? Promise.resolve({ username: u.email }) : Promise.reject(new Error('Chưa đăng nhập'));
  };

  window.firebaseOnAuthState = function (callback) {
    auth.onAuthStateChanged(callback);
  };

  window.firebaseChangePassword = function (currentPassword, newPassword) {
    var user = auth.currentUser;
    if (!user || !user.email) return Promise.reject(new Error('Chưa đăng nhập'));
    var cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    return user.reauthenticateWithCredential(cred).then(function () {
      return user.updatePassword(newPassword);
    });
  };
})();
