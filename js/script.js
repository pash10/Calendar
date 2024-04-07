$(document).ready(function() {
    // Initialize the calendar with configurations
    $('#calendar').fullCalendar({
        // Customization options here
        eventRender: function(event, element) {
            element.bind('contextmenu', function(e) {
                e.preventDefault(); // Prevent the default context menu
                showContextMenu(e, event);
            });
        },
        events: function(start, end, timezone, callback) {
            loadUserEvents(callback); // Load events dynamically
        }
    });
// Dynamically load user events from Firebase
function loadUserEvents(callback) {
    var user = firebase.auth().currentUser;
    if (user) {
        var eventsRef = firebase.database().ref('events/' + user.uid);
        eventsRef.once('value', snapshot => {
            var events = [];
            snapshot.forEach(childSnapshot => {
                var event = childSnapshot.val();
                event.id = childSnapshot.key; // Use Firebase key as event ID
                events.push(event);
            });
            callback(events); // Use the events array to populate the calendar
        }).catch(error => {
            console.error('Error loading events:', error);
        });
    }
}

    // Add recurring or single events based on form inputs
    $('#addEventForm').submit(function(e) {
        e.preventDefault();

        var title = $('#eventTitle').val();
        var start = $('#eventStart').val();
        var untilDate = $('#eventEnd').val();
        var recurInterval = $('#recurInterval').val() ? parseInt($('#recurInterval').val(), 10) : null;
        var durationDays = $('#durationDays').val() ? parseInt($('#durationDays').val(), 10) : 0;

        if (recurInterval && durationDays) {
            addRecurringEvents(title, start, recurInterval, durationDays, untilDate);
        } else {
            $('#calendar').fullCalendar('renderEvent', {
                title: title,
                start: start,
                end: moment(start).add(durationDays, 'days').format(),
                allDay: true
            }, true); // Stick the event
        }

        // Clear form fields
        $('#eventTitle').val('');
        $('#eventStart').val('');
        $('#recurInterval').val('');
        $('#durationDays').val('');
        $('#eventEnd').val('');
    });

    // Show context menu
    function showContextMenu(e, event) {
        $('#contextMenu').css({
            display: "block",
            left: e.pageX + 'px',
            top: e.pageY + 'px'
        });

        // Delete event
        $('#deleteEvent').off('click').on('click', function() {
            $('#calendar').fullCalendar('removeEvents', event._id);
            $('#contextMenu').hide();
        });

        // Edit event
        $('#editEvent').off('click').on('click', function() {
            $('#contextMenu').hide();
            fillEditModal(event);
            $('#editEventModal').modal('show');
        });
    }

    // Fill the edit modal with event details
    function fillEditModal(event) {
        $('#editEventId').val(event._id);
        $('#editEventTitle').val(event.title);
        // Assuming event.end is a moment object
        $('#editEventEnd').val(event.end ? moment(event.end).format('YYYY-MM-DD') : '');
        // These next fields depend on your implementation to store these values with the event
        $('#editEventDuration').val(event.durationDays || '');
        $('#editEventRecur').val(event.recurInterval || '');
    }

    // Save changes from the edit modal
    $('#saveEventChanges').click(function() {
        var eventId = $('#editEventId').val();
        var updatedTitle = $('#editEventTitle').val();
        var updatedEnd = $('#editEventEnd').val();
        var updatedDuration = $('#editEventDuration').val();
        var updatedRecur = $('#editEventRecur').val();

        var event = $('#calendar').fullCalendar('clientEvents', eventId)[0];
        if (event) {
            event.title = updatedTitle;
            event.end = updatedEnd;
            // Update duration and recurrence if you store these with the event
            // FullCalendar itself doesn't track these values by default
            $('#calendar').fullCalendar('updateEvent', event);
        }

        $('#editEventModal').modal('hide');
    });

    // Hide context menu on document click
    $(document).on('click', function() {
        $('#contextMenu').hide();
    });

    // Add recurring events
    function addRecurringEvents(title, start, recurInterval, durationDays, untilDate) {
        var startDate = moment(start);
        var endDate = moment(start).add(durationDays, 'days');

        var loopEndDate = untilDate ? moment(untilDate) : moment().add(1, 'year');

        while (startDate.isBefore(loopEndDate)) {
            $('#calendar').fullCalendar('renderEvent', {
                title: title,
                start: startDate.format(),
                end: endDate.format(),
                allDay: true
            }, true);

            startDate.add(recurInterval, 'weeks');
            endDate = moment(startDate).add(durationDays, 'days');
        }
    }
});

function loadUserEvents() {
    var user = firebase.auth().currentUser;
    if (user) {
        var eventsRef = firebase.database().ref('events/' + user.uid);
        eventsRef.once('value', (snapshot) => {
            var events = [];
            snapshot.forEach((childSnapshot) => {
                var event = childSnapshot.val();
                event.id = childSnapshot.key; // Use Firebase key as event ID
                events.push(event);
            });
            // Now use the events array to populate the calendar
            $('#calendar').fullCalendar('removeEvents'); // Remove existing events
            $('#calendar').fullCalendar('addEventSource', events); // Add new events
        }).catch((error) => {
            console.error('Error loading events:', error);
        });
    }
}

// Call loadUserEvents function after user login or as part of your page initialization logic
// Make sure this is called after Firebase authentication state is confirmed

// Example: Loading events after user sign-in
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // User is signed in, load their events
        $('#calendar').fullCalendar('refetchEvents');
    } else {
        // User is signed out, clear the calendar
        $('#calendar').fullCalendar('removeEvents');
    }
});