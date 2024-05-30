document.addEventListener('DOMContentLoaded', () => {
    const calendarContainer = document.getElementById('calendar');
    const eventForm = document.getElementById('event-form-details');
    const deleteButton = document.getElementById('delete-event');
    const viewSelect = document.getElementById('view-select');
    const events = JSON.parse(localStorage.getItem('events')) || {};
    let selectedDate = null;
    let currentYear = 2024;
    let currentMonth = new Date().getMonth();

    const colors = [
        '#4CAF50', '#FF9800', '#2196F3', '#9C27B0', '#FF5722',
        '#00BCD4', '#673AB7', '#CDDC39', '#009688', '#FF5252',
        '#3F51B5', '#E91E63'
    ];
    let colorIndex = 0;

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const daysOfWeek = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

    const generarOpcionesHorarios = () => {
        const selectHora = document.getElementById('event-time');
        selectHora.innerHTML = '';
        const inicioDia = new Date();
        inicioDia.setHours(0, 0, 0, 0);
        const finDia = new Date();
        finDia.setHours(23, 59, 59, 999);
        
        for (let hora = inicioDia.getTime(); hora <= finDia.getTime(); hora += 30 * 60000) {
            const opcion = document.createElement('option');
            const horaActual = new Date(hora);
            opcion.value = horaActual.getHours() + ':' + ('0' + horaActual.getMinutes()).slice(-2);
            opcion.textContent = horaActual.toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true});
            selectHora.appendChild(opcion);
        }
    };

    const generarOpcionesMeses = () => {
        const selectMes = document.getElementById('month-select');
        selectMes.innerHTML = '';
        const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        meses.forEach((mes, index) => {
            const opcion = document.createElement('option');
            opcion.value = index;
            opcion.textContent = mes;
            selectMes.appendChild(opcion);
        });
    };

    const renderCalendar = () => {
        calendarContainer.innerHTML = '';
        const view = viewSelect.value;
        if (view === 'annual') {
            renderAnnualView();
        } else if (view === 'monthly') {
            currentMonth = document.getElementById('month-select').value;
            renderMonthlyView();
        } else if (view === 'daily') {
            renderDailyView();
        }
    };

    const renderAnnualView = () => {
        for (let month = 0; month < 12; month++) {
            const monthDiv = document.createElement('div');
            monthDiv.className = 'month';
            const monthName = new Date(currentYear, month).toLocaleString('es-ES', { month: 'long' });
            monthDiv.innerHTML = `<h3>${capitalizeFirstLetter(monthName)}</h3>`;
            
            const daysHeader = document.createElement('div');
            daysHeader.className = 'days-header';
            daysOfWeek.forEach(day => {
                const dayHeader = document.createElement('div');
                dayHeader.className = 'day-header';
                dayHeader.innerText = day;
                daysHeader.appendChild(dayHeader);
            });
            monthDiv.appendChild(daysHeader);

            const firstDay = new Date(currentYear, month, 1).getDay();
            for (let i = 0; i < firstDay; i++) {
                const emptyDiv = document.createElement('div');
                emptyDiv.className = 'day empty';
                monthDiv.appendChild(emptyDiv);
            }

            for (let day = 1; day <= new Date(currentYear, month + 1, 0).getDate(); day++) {
                const dayDiv = document.createElement('div');
                dayDiv.className = 'day';
                dayDiv.innerText = day;
                const dateKey = `${currentYear}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                if (events[dateKey]) {
                    const event = events[dateKey];
                    dayDiv.classList.add('event');
                    dayDiv.style.backgroundColor = event.color;
                    dayDiv.innerHTML += `<span class="event-description">${event.description}</span>`;
                }
                dayDiv.addEventListener('click', () => {
                    selectedDate = dateKey;
                    const event = events[dateKey] || {};
                    document.getElementById('event-date').value = dateKey;
                    document.getElementById('event-time').value = event.time || '';
                    document.getElementById('event-description').value = event.description || '';
                    document.getElementById('event-participants').value = event.participants || '';
                });
                monthDiv.appendChild(dayDiv);
            }
            calendarContainer.appendChild(monthDiv);
        }
    };

    const renderMonthlyView = () => {
        const monthDiv = document.createElement('div');
        monthDiv.className = 'month';
        const monthName = new Date(currentYear, currentMonth).toLocaleString('es-ES', { month: 'long' });
        monthDiv.innerHTML = `<h3>${capitalizeFirstLetter(monthName)}</h3>`;
        
        const daysHeader = document.createElement('div');
        daysHeader.className = 'days-header';
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.innerText = day;
            daysHeader.appendChild(dayHeader);
        });
        monthDiv.appendChild(daysHeader);

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        for (let i = 0; i < firstDay; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'day empty';
            monthDiv.appendChild(emptyDiv);
        }

        for (let day = 1; day <= new Date(currentYear, currentMonth + 1, 0).getDate(); day++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            dayDiv.innerText = day;
            const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            if (events[dateKey]) {
                const event = events[dateKey];
                dayDiv.classList.add('event');
                dayDiv.style.backgroundColor = event.color;
                dayDiv.innerHTML += `<span class="event-description">${event.description}</span>`;
            }
            dayDiv.addEventListener('click', () => {
                selectedDate = dateKey;
                const event = events[dateKey] || {};
                document.getElementById('event-date').value = dateKey;
                document.getElementById('event-time').value = event.time || '';
                document.getElementById('event-description').value = event.description || '';
                document.getElementById('event-participants').value = event.participants || '';
            });
            monthDiv.appendChild(dayDiv);
        }
        calendarContainer.appendChild(monthDiv);
    };

    const renderDailyView = () => {
        calendarContainer.innerHTML = '';
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        const selectedDay = selectedDate || new Date().toISOString().split('T')[0];
        const dayName = new Date(selectedDay).toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        dayDiv.innerHTML = `<h3>${capitalizeFirstLetter(dayName)}</h3>`;
        
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeKey = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                const eventKey = `${selectedDay} ${timeKey}`;
                if (events[eventKey]) {
                    const event = events[eventKey];
                    const hourDiv = document.createElement('div');
                    hourDiv.className = 'hour event';
                    hourDiv.style.backgroundColor = event.color;
                    hourDiv.innerHTML = `<span class="event-time">${timeKey}</span> <span class="event-description">${event.description}</span>`;
                    hourDiv.addEventListener('click', () => {
                        selectedDate = selectedDay;
                        document.getElementById('event-date').value = selectedDay;
                        document.getElementById('event-time').value = timeKey;
                        document.getElementById('event-description').value = event.description || '';
                        document.getElementById('event-participants').value = event.participants || '';
                    });
                    dayDiv.appendChild(hourDiv);
                } else {
                    const hourDiv = document.createElement('div');
                    hourDiv.className = 'hour';
                    hourDiv.innerHTML = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                    hourDiv.addEventListener('click', () => {
                        selectedDate = selectedDay;
                        document.getElementById('event-date').value = selectedDay;
                        document.getElementById('event-time').value = timeKey;
                        document.getElementById('event-description').value = '';
                        document.getElementById('event-participants').value = '';
                    });
                    dayDiv.appendChild(hourDiv);
                }
            }
        }
        calendarContainer.appendChild(dayDiv);
    };

    const saveEvent = () => {
        const date = document.getElementById('event-date').value;
        const time = document.getElementById('event-time').value;
        const description = document.getElementById('event-description').value;
        const participants = document.getElementById('event-participants').value;

        if (!date || !time || !description) {
            alert('Por favor completa todos los campos: Fecha, Hora y Descripción.');
            return;
        }

        const dateTime = `${date} ${time}`;
        const color = colors[colorIndex % colors.length]; // Seleccionar color basado en el índice
        colorIndex++;

        events[dateTime] = { description, participants, color };
        localStorage.setItem('events', JSON.stringify(events));

        renderCalendar();
        clearForm();
    };

    const deleteEvent = () => {
        if (!selectedDate) {
            alert('Selecciona un evento para eliminarlo.');
            return;
        }

        if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
            delete events[selectedDate];
            localStorage.setItem('events', JSON.stringify(events));
            selectedDate = null;
            renderCalendar();
            clearForm();
        }
    };

    const clearForm = () => {
        document.getElementById('event-date').value = '';
        document.getElementById('event-time').value = '';
        document.getElementById('event-description').value = '';
        document.getElementById('event-participants').value = '';
    };

    // Event listeners
    viewSelect.addEventListener('change', renderCalendar);
    document.getElementById('month-select').addEventListener('change', renderCalendar);
    document.getElementById('add-event').addEventListener('click', saveEvent);
    deleteButton.addEventListener('click', deleteEvent);
    document.getElementById('cancel-event').addEventListener('click', clearForm);
    document.getElementById('event-time').addEventListener('click', generarOpcionesHorarios);
    document.getElementById('month-select').addEventListener('click', generarOpcionesMeses);

    // Initialize
    generarOpcionesHorarios();
    generarOpcionesMeses();
    renderCalendar();
});

