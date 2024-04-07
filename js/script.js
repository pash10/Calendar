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
    
        var user = firebase.auth().currentUser;
        if (!user) {
            console.error("User not authenticated");
            return;
        }
    
        var title = $('#eventTitle').val();
        var start = $('#eventStart').val();
        var end = $('#eventEnd').val() || start; // Default end date is start date
        var isBiWeekly = $('#isBiWeekly').is(':checked');
        var recurInterval = isBiWeekly ? 2 : null; // 2 weeks for bi-weekly recurrence
        var durationDays = $('#durationDays').val() ? parseInt($('#durationDays').val(), 10) : 0;
        var untilDate = $('#eventEnd').val();
    
        // If Bi-weekly event is checked, handle as recurring event
        if (isBiWeekly && durationDays) {
            addRecurringEvents(title, start, recurInterval, durationDays, untilDate);
        } else {
            // Handle adding a single event
            var eventData = {
                title: title,
                start: start,
                end: end,
                allDay: true
            };
    
            // Save the event to Firebase
            firebase.database().ref('events/' + user.uid).push(eventData).then(() => {
                console.log("Event added successfully.");
                $('#calendar').fullCalendar('refetchEvents'); // Reload the events
            }).catch(error => {
                console.error("Error adding event:", error);
            });
        }
    
        // Clear form fields
        $('#eventTitle').val('');
        $('#eventStart').val('');
        $('#eventEnd').val('');
        $('#recurInterval').val('');
        $('#durationDays').val('');
        $('#isBiWeekly').prop('checked', false); // Reset the checkbox
    });
    

    // Show context menu
    function showContextMenu(e, event) {
        $('#contextMenu').css({
            display: "block",
            left: e.pageX + 'px',
            top: e.pageY + 'px'
        });

        // Implement delete functionality
        $('#deleteEvent').off('click').on('click', function() {
            var user = firebase.auth().currentUser;
            if (user) {
                firebase.database().ref('events/' + user.uid + '/' + event.id).remove().then(() => {
                    console.log("Event removed successfully.");
                    $('#calendar').fullCalendar('refetchEvents'); // Reload the events
                }).catch(error => {
                    console.error("Error removing event:", error);
                });
            }
            $('#contextMenu').hide();
        });


        // Load event details into the edit modal
        $('#editEvent').off('click').on('click', function() {
            fillEditModal(event);
            $('#editEventModal').modal('show');
            $('#contextMenu').hide();
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
        var updatedEvent = {
            title: $('#editEventTitle').val(),
            start: $('#editEventStart').val(),
            end: $('#editEventEnd').val() || $('#editEventStart').val(),
            allDay: true
        };

        var user = firebase.auth().currentUser;
        if (user) {
            firebase.database().ref('events/' + user.uid + '/' + eventId).update(updatedEvent).then(() => {
                console.log("Event updated successfully.");
                $('#editEventModal').modal('hide');
                $('#calendar').fullCalendar('refetchEvents'); // Reload the events
            }).catch(error => {
                console.error("Error updating event:", error);
            });
        }
    });

    // Hide context menu on document click
    $(document).on('click', function() {
        $('#contextMenu').hide();
    });

    // Add recurring events
    function addRecurringEvents(title, start, recurInterval, durationDays, untilDate) {
        var user = firebase.auth().currentUser;
        if (!user) {
            console.error("User not authenticated");
            return;
        }
    
        var startDate = moment(start);
        var endDate = moment(start).add(durationDays, 'days');
        var loopEndDate = untilDate ? moment(untilDate) : moment().add(1, 'year');
        var eventsRef = firebase.database().ref('events/' + user.uid);
    
        while (startDate.isBefore(loopEndDate)) {
            var newEvent = {
                title: title,
                start: startDate.format(),
                end: endDate.format(),
                allDay: true
            };
    
            // Save each occurrence to Firebase
            eventsRef.push(newEvent).catch(error => {
                console.error("Error adding recurring event:", error);
            });
    
            // Prepare for the next iteration
            startDate.add(recurInterval, 'weeks');
            endDate = moment(startDate).add(durationDays, 'days');
        }
    
        // After all events are added, refetch them to update the calendar display
        $('#calendar').fullCalendar('refetchEvents');
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
});