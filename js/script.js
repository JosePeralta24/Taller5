document.addEventListener('DOMContentLoaded', () => {
    const viewYearButton = document.getElementById('viewYear');
    const viewMonthButton = document.getElementById('viewMonth');
    const viewDayButton = document.getElementById('viewDay');
    const yearView = document.getElementById('yearView');
    const monthView = document.getElementById('monthView');
    const dayView = document.getElementById('dayView');
    const form = document.getElementById('form');
    const eventList = document.getElementById('eventList');
    
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const daysOfWeek = ['L', 'M', 'Mi', 'J', 'V', 'S', 'D'];
    
    let events = [];
    
    viewYearButton.addEventListener('click', () => {
        displayView('year');
        displayYearView();
    });
    
    viewMonthButton.addEventListener('click', () => {
        displayView('month');
        displayMonthView();
    });
    
    viewDayButton.addEventListener('click', () => {
        displayView('day');
        displayDayView();
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const eventDate = document.getElementById('eventDate').value;
        const eventTime = document.getElementById('eventTime').value;
        const eventDescription = document.getElementById('eventDescription').value;
        const eventParticipants = document.getElementById('eventParticipants').value;
        const eventColor = getRandomColor();
        
        const event = {
            date: eventDate,
            time: eventTime,
            description: eventDescription,
            participants: eventParticipants,
            color: eventColor
        };
        
        events.push(event);
        renderEventList();
        form.reset();
    });
    
    function displayView(view) {
        yearView.style.display = 'none';
        monthView.style.display = 'none';
        dayView.style.display = 'none';
        
        if (view === 'year') {
            yearView.style.display = 'grid';
        } else if (view === 'month') {
            monthView.style.display = 'grid';
        } else if (view === 'day') {
            dayView.style.display = 'grid';
        }
    }
    
    function displayYearView() {
        yearView.innerHTML = '';
        months.forEach((month, index) => {
            const monthDiv = document.createElement('div');
            monthDiv.className = 'month';
            monthDiv.innerHTML = `<h3>${month}</h3>`;
            monthDiv.appendChild(createMonthDays(index));
            yearView.appendChild(monthDiv);
        });
    }
    
    function displayMonthView() {
        monthView.innerHTML = '';
        const currentMonth = new Date().getMonth();
        const monthDiv = document.createElement('div');
        monthDiv.className = 'month';
        monthDiv.innerHTML = `<h3>${months[currentMonth]}</h3>`;
        monthDiv.appendChild(createMonthDays(currentMonth));
        monthView.appendChild(monthDiv);
    }
    
    function displayDayView() {
        dayView.innerHTML = '';
        for (let hour = 0; hour < 24; hour++) {
            const hourDiv = document.createElement('div');
            hourDiv.className = 'hour';
            hourDiv.innerHTML = `${hour}:00`;
            dayView.appendChild(hourDiv);
        }
    }
    
    function createMonthDays(monthIndex) {
        const daysDiv = document.createElement('div');
        daysDiv.className = 'days';
        
        const firstDay = new Date(2024, monthIndex, 1).getDay();
        const daysInMonth = new Date(2024, monthIndex + 1, 0).getDate();
        
        daysOfWeek.forEach(day => {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'dayOfWeek';
            dayDiv.innerHTML = day;
            daysDiv.appendChild(dayDiv);
        });
        
        for (let i = 0; i < firstDay; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty';
            daysDiv.appendChild(emptyDiv);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            dayDiv.innerHTML = day;
            daysDiv.appendChild(dayDiv);
        }
        
        return daysDiv;
    }
    
    function renderEventList() {
        eventList.innerHTML = '';
        events.forEach((event, index) => {
            const eventItem = document.createElement('li');
            eventItem.style.backgroundColor = event.color;
            eventItem.innerHTML = `${event.date} ${event.time} - ${event.description} - ${event.participants}<button onclick="deleteEvent(${index})">Eliminar</button>`;
            eventList.appendChild(eventItem);
        });
    }
    
    window.deleteEvent = (index) => {
        events.splice(index, 1);
        renderEventList();
    };
    
    function getRandomColor() {
        const colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D', '#80B300', '#809900'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    displayView('year');
    displayYearView();
});
