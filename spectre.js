(function(window) {
    'use strict';

    function Event() {
        var _state = ["Registered", "Triggered", "Waiting", "Completed"];

        var _config = {
            registerAutomatically: true,
            evObj: {
                name: '',
                fn: '',
                state: _state[0]
            }
        }


        var events = {}

        /**
         * Events for automatic subscription
         */
        var unSubscribedEvent = {};

        var eventMethods = {
            on: function(name, fn) {
                var data = null;
                /**
                 * Before subscribing check for already triggered events
                 */
                var isUnsubscrbed = false;
                if (unSubscribedEvent[name]) {
                    /**
                     * publish this event first and then let the function continue.
                     * This could also be a promise to make sure that the function executes asynchronously
                     * 
                     */
                    data = unSubscribedEvent[name].data;
                    /**
                     * To make sure that the event is published after automatic subscription
                     */
                    isUnsubscrbed = true;
                }
                /**
                 * Initialize events[name] = [] so that the function calls do not stack up and trigger it multiple times
                 */
                events[name] = [];
                // var idx = 0;

                /**
                 * If the same function already exists then remove the previous one and re-register a new function to maintain the reference to the subscribed object
                 */
                // events[name].forEach(function(e) {
                //     if (e.fn.toString() === fn.toString()) {
                //         events[name].splice(idx, 1);
                //     }
                //     idx++;
                // })

                events[name].push({
                    name: name,
                    fn: fn,
                    state: _state[0]
                });

                if (isUnsubscrbed) {
                    /**
                     * Once subscribed to, publish the event back to receive the data and store it as per the local logic or the callback provided
                     */
                    this.publish(name, unSubscribedEvent[name].data);
                    /**
                     * Remove event once subscription is successful
                     */
                    unSubscribedEvent[name] = null;
                }
            },
            publish: function(name, data) {
                /**
                 * If event is triggered and is not Registered then save the data 
                 */
                if (!events[name]) {
                    /**
                     * Create new unSubscribedEvent object every time such an event is registered 
                     * All unSubscribedEvent will not need explicit registration. These will be autosubscribed. The function calls will get overwritten.
                     */
                    unSubscribedEvent[name] = {};
                    unSubscribedEvent[name] = { name: name, data: data };
                    /**
                     * Return after storing the unsubscribed event since continuing will throw an error
                     */
                    return;
                }
                /**
                 * If event is subscribed then run normally
                 */
                /**
                 * Maintinaing loop count
                 */
                events[name].forEach(function(val) {
                    /**
                     * Trigger only events which did not execute before
                     */
                    val.state = _state[1];
                    val.fn(data);
                    val.state = _state[3];
                });


            },
            removeTriggeredEvents: function(name) {

            }
        }

        return eventMethods;
    }



    if (typeof(eventMethods) === 'undefined') {
        window.eventManager = Event();
    } else {
        console.log("Library already defined.");
    }
})(window);


Array.prototype.match = function(val) {
    var isMatch = false;
    this.forEach(function(e) {
        if (e.fn.toString() === val) {
            isMatch = true;
            return isMatch;
        }
    });

    return isMatch;

}