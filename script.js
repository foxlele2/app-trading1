(function () {
  "use strict";

  var STORAGE_KEY = "torneo-baseball-u15-tenerife";

  var form = document.getElementById("signupForm");
  var confirmation = document.getElementById("confirmation");
  var confTeam = document.getElementById("confTeam");
  var newSignupBtn = document.getElementById("newSignup");
  var tableBody = document.querySelector("#entriesTable tbody");
  var countEl = document.getElementById("count");
  var exportBtn = document.getElementById("exportCsv");
  var clearBtn = document.getElementById("clearAll");

  function loadEntries() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  function formatDate(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString("it-IT") + " " +
      d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function render() {
    var entries = loadEntries();
    countEl.textContent = entries.length;
    tableBody.innerHTML = "";
    entries.forEach(function (e) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" + escapeHtml(e.team) + "</td>" +
        "<td>" + escapeHtml(e.club) + "</td>" +
        "<td>" + escapeHtml(e.contact) + "</td>" +
        "<td>" + escapeHtml(e.email) + "</td>" +
        "<td>" + escapeHtml(e.phone) + "</td>" +
        "<td>" + escapeHtml(e.players) + "</td>" +
        "<td>" + escapeHtml(formatDate(e.createdAt)) + "</td>";
      tableBody.appendChild(tr);
    });
  }

  function validate() {
    var ok = true;
    var required = form.querySelectorAll("[required]");
    required.forEach(function (el) {
      var valid = el.type === "checkbox" ? el.checked : String(el.value).trim() !== "";
      if (el.type === "email" && valid) {
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value);
      }
      el.classList.toggle("invalid", !valid);
      if (!valid) ok = false;
    });
    return ok;
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (!validate()) {
      var firstInvalid = form.querySelector(".invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var lodging = form.querySelector('input[name="lodging"]:checked');
    var entry = {
      team: form.team.value.trim(),
      club: form.club.value.trim(),
      contact: form.contact.value.trim(),
      role: form.role.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      country: form.country.value.trim(),
      players: form.players.value.trim(),
      lodging: lodging ? lodging.value : "",
      notes: form.notes.value.trim(),
      createdAt: new Date().toISOString()
    };

    var entries = loadEntries();
    entries.push(entry);
    saveEntries(entries);
    render();

    confTeam.textContent = entry.team;
    form.hidden = true;
    confirmation.hidden = false;
    confirmation.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  newSignupBtn.addEventListener("click", function () {
    form.reset();
    form.hidden = false;
    confirmation.hidden = true;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  exportBtn.addEventListener("click", function () {
    var entries = loadEntries();
    if (!entries.length) {
      alert("Nessuna adesione da esportare.");
      return;
    }
    var headers = ["Squadra", "Club", "Referente", "Ruolo", "Email", "Telefono",
      "Paese/Citta", "Giocatori", "Alloggio", "Note", "Data"];
    var rows = entries.map(function (e) {
      return [e.team, e.club, e.contact, e.role, e.email, e.phone,
        e.country, e.players, e.lodging, e.notes, formatDate(e.createdAt)];
    });

    function csvCell(v) {
      v = String(v == null ? "" : v);
      return '"' + v.replace(/"/g, '""') + '"';
    }

    var csv = [headers].concat(rows)
      .map(function (r) { return r.map(csvCell).join(","); })
      .join("\r\n");

    var blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "adesioni-torneo-u15-tenerife.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  clearBtn.addEventListener("click", function () {
    if (confirm("Sei sicuro di voler cancellare tutte le adesioni salvate in questo browser?")) {
      localStorage.removeItem(STORAGE_KEY);
      render();
    }
  });

  render();
})();
