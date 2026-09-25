const state = { dashboard: null, report: null };
const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const mealTypes = [{ id: 'cafe-da-manha', label: 'Café da manhã' }, { id: 'almoco', label: 'Almoço' }, { id: 'jantar', label: 'Jantar' }];

function weekDates(startDate) {
    return Array.from({ length: 5 }, (_, index) => {
        const date = new Date(`${startDate}T12:00:00`);
        date.setDate(date.getDate() + index);
        return date.toISOString().slice(0, 10);
    });
}

function getWeekStart(date = new Date()) {
    const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
}

function groupedMenu(menu) {
    return menu.reduce((days, item) => {
        const day = days[item.date] || (days[item.date] = {});
        day[item.mealType || 'almoco'] = item;
        return days;
    }, {});
}

async function request(url, options = {}) {
    const response = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Não foi possível concluir a operação.');
    return data;
}

function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3200);
}

function renderMenu(menu) {
    const formatDay = (date) => new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase();
    const formatDate = (date) => new Date(`${date}T12:00:00`).getDate();
    const grouped = groupedMenu(menu);
    const today = new Date().toISOString().slice(0, 10);
    const todayMenu = grouped[today] || {};
    $('#today-menu-list').innerHTML = mealTypes.map((type) => {
        const item = todayMenu[type.id];
        return `<article class="today-meal"><strong>${type.label}</strong>${item ? `<p>${escapeHtml(item.meal)}</p><small>${item.allergens.length ? `Alérgenos: ${escapeHtml(item.allergens.join(', '))}` : 'Sem alérgenos informados'}</small>` : '<p class="empty-meal">Ainda não publicado</p>'}</article>`;
    }).join('');
    const dates = weekDates($('#week-start').value || getWeekStart());
    const renderMeals = (date) => mealTypes.map((type) => {
        const item = (grouped[date] || {})[type.id];
        return `<div class="week-meal-line"><strong>${type.label}</strong><span>${item ? escapeHtml(item.meal) : 'Não publicado'}</span><small>${item?.allergens.length ? `Alérgenos: ${escapeHtml(item.allergens.join(', '))}` : item ? 'Sem alérgenos informados' : ''}</small></div>`;
    }).join('');
    $('#menu-list').innerHTML = dates.map((date) => `<div class="menu-row week-menu-row"><div class="menu-day"><strong>${formatDate(date)}</strong><small>${formatDay(date)}</small></div><div class="menu-copy">${renderMeals(date)}</div></div>`).join('');
    $('#full-menu-list').innerHTML = dates.map((date) => `<section class="full-menu-day"><div class="full-menu-day-heading"><strong>${formatDate(date)} ${formatDay(date)}</strong><small>${date}</small></div><div>${renderMeals(date)}</div></section>`).join('');
    renderWeeklyEditor(grouped, dates);
}

function renderWeeklyEditor(grouped, dates) {
    const formatDate = (date) => new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' });
    $('#weekly-menu-days').innerHTML = dates.map((date, dayIndex) => `<fieldset class="weekly-day"><legend>${formatDate(date)}</legend><div class="weekly-day-meals">${mealTypes.map((type) => {
        const item = (grouped[date] || {})[type.id] || {};
        return `<div class="weekly-meal-editor"><h3>${type.label}</h3><label>Refeição<input name="days[${dayIndex}][${type.id}][meal]" value="${escapeHtml(item.meal || '')}" required></label><label>Alérgenos, separados por vírgula<input name="days[${dayIndex}][${type.id}][allergens]" value="${escapeHtml((item.allergens || []).join(', '))}" placeholder="Ex.: leite, ovos"></label></div>`;
    }).join('')}</div></fieldset>`).join('');
}

function renderNotifications(items) {
    $('#notification-list').innerHTML = items.slice(0, 3).map((item) => `<div class="notification-item ${item.read ? 'read' : ''}"><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.text)}</p><small>${escapeHtml(item.date)}</small></div>`).join('');
}

function renderStudents(students) {
    $('#student-total').textContent = `${students.length} alunos cadastrados`;
    $('#students-list').innerHTML = students.map((student) => `<div class="student-row"><div class="student-name"><span class="student-avatar">${student.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><div><strong>${escapeHtml(student.name)}</strong><small>Matrícula: ${escapeHtml(student.enrollment)} · Código: ${escapeHtml(student.accessCode)}</small></div></div><span>${escapeHtml(student.className)}</span><span>${student.restrictions.length ? student.restrictions.map((restriction) => `<span class="restriction">${escapeHtml(restriction)}</span>`).join('') : '<span class="no-restriction">Nenhuma restrição</span>'}</span><span>${student.restrictions.length ? 'Atenção alimentar' : 'Cadastro completo'}</span></div>`).join('');
}

async function loadDashboard() {
    state.dashboard = await request('/api/dashboard');
    const { students, present, prepared, consumed, menu, notifications, studentsList } = state.dashboard;
    $('#students-count').textContent = students;
    $('#present-count').textContent = present;
    $('#prepared-count').textContent = prepared;
    $('#consumed-count').textContent = consumed;
    $('#coverage-count').textContent = `${Math.round((consumed / prepared) * 100)}%`;
    renderMenu(menu); renderNotifications(notifications); renderStudents(studentsList);
}

async function loadReports() {
    state.report = await request('/api/reports');
    const { meals, countByClass } = state.report;
    $('#report-prepared').textContent = meals.prepared;
    $('#report-consumed').textContent = meals.consumed;
    $('#prepared-progress').style.width = `${Math.min(meals.prepared / 140 * 100, 100)}%`;
    $('#consumed-progress').style.width = `${Math.min(meals.consumed / meals.prepared * 100, 100)}%`;
    $('#consumption-rate').textContent = `${Math.round(meals.consumed / meals.prepared * 100)}%`;
    $('#class-report').innerHTML = Object.entries(countByClass).map(([className, count]) => `<div class="class-bar"><i style="height:${Math.max(25, count * 28)}px"></i>${escapeHtml(className)}<br><b>${count}</b></div>`).join('');
}

function navigate(section) {
    document.querySelectorAll('.page-section').forEach((item) => item.classList.toggle('active-section', item.id === section));
    document.querySelectorAll('.nav-link[data-section]').forEach((item) => item.classList.toggle('active', item.dataset.section === section));
    $('.sidebar').classList.remove('open');
    if (section === 'relatorios') loadReports().catch(() => showToast('Não foi possível carregar o relatório.'));
}

document.querySelectorAll('[data-section]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); navigate(link.dataset.section); history.replaceState(null, '', `#${link.dataset.section}`); }));
$('.menu-toggle').addEventListener('click', () => $('.sidebar').classList.toggle('open'));
$('#week-start').value = getWeekStart();
$('#week-start').addEventListener('change', () => {
    if (!$('#week-start').value) return;
    $('#week-start').value = getWeekStart(new Date(`${$('#week-start').value}T12:00:00`));
    if (state.dashboard) renderMenu(state.dashboard.menu);
});
$('#weekly-menu-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const dates = weekDates($('#week-start').value);
    const days = dates.map((date, dayIndex) => ({ date, meals: Object.fromEntries(mealTypes.map((type) => {
        const prefix = `days[${dayIndex}][${type.id}]`;
        return [type.id, { meal: $(`[name="${prefix}[meal]"]`).value, allergens: $(`[name="${prefix}[allergens]"]`).value.split(',').map((value) => value.trim()).filter(Boolean) }];
    })) }));
    const feedback = $('#weekly-menu-feedback');
    try {
        const result = await request('/api/menu/week', { method: 'PUT', body: JSON.stringify({ days }) });
        feedback.textContent = result.changedDates.length ? 'Cardápio publicado. Os dias alterados geraram notificações.' : 'Cardápio salvo; não houve alterações para notificar.';
        feedback.style.color = '#579775';
        await loadDashboard();
    } catch (error) { feedback.textContent = error.message; feedback.style.color = '#d56d5a'; }
});
$('#new-student-button').addEventListener('click', async () => { const name = prompt('Nome completo do aluno:'); if (!name) return; const enrollment = prompt('Matrícula:'); const className = prompt('Turma ou série:', '5º ano A'); if (!enrollment || !className) return; try { await request('/api/students', { method: 'POST', body: JSON.stringify({ name, enrollment, className, restrictions: [] }) }); showToast('Aluno cadastrado.'); await loadDashboard(); } catch (error) { showToast(error.message); } });
$('#student-search').addEventListener('input', (event) => { const term = event.target.value.toLowerCase(); renderStudents(state.dashboard.studentsList.filter((student) => `${student.name} ${student.enrollment}`.toLowerCase().includes(term))); });
$('#export-button').addEventListener('click', () => { const blob = new Blob([JSON.stringify(state.report, null, 2)], { type: 'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'relatorio-prato-vivo.json'; link.click(); URL.revokeObjectURL(link.href); showToast('Relatório exportado.'); });
loadDashboard().catch(() => showToast('Não foi possível carregar os dados.'));
