
YUI.add("event-target", function(Y) {

    /**
     * Event.Target is designed to be used with Y.augment to wrap 
     * Event.Custom in an interface that allows events to be subscribed to 
     * and fired by name.  This makes it possible for implementing code to
     * subscribe to an event that either has not been created yet, or will
     * not be created at all.
     *
     * @Class Event.Target
     */
    Y.EventTarget = function() { };

    Y.EventTarget.prototype = {

        /**
         * Private storage of custom events
         * @property __yui_events
         * @type Object[]
         * @private
         */
        __yui_events: null,

        /**
         * Private storage of bubble targets
         * @property __yui_targets
         * @type {}
         * @private
         */
        __yui_targets: null,

        /**
         * Subscribe to a Event.Custom by event type
         *
         * @method subscribe
         * @param type    {string}   The type, or name of the event
         * @param fn      {function} The function to exectute when the event fires
         * @param context {Object}   An object to be passed along when the event 
         *                            fires
         */
        subscribe: function(type, fn, context, p_override) {

            this.__yui_events = this.__yui_events || {};

            var ce = this.__yui_events[type] || this.publish(type),
                a = Y.array(arguments, 1, true);

            // return ce.subscribe(fn, context, p_override);
            return ce.subscribe.apply(ce, a);

        },

        /**
         * Unsubscribes one or more listeners the from the specified event
         * @method unsubscribe
         * @param type {string|Object}   Either the handle to the subscriber or the 
         *                        type of event.  If the type
         *                        is not specified, it will attempt to remove
         *                        the listener from all hosted events.
         * @param fn   {Function} The subscribed function to unsubscribe, if not
         *                          supplied, all subscribers will be removed.
         * @param context  {Object}   The custom object passed to subscribe.  This is
         *                        optional, but if supplied will be used to
         *                        disambiguate multiple listeners that are the same
         *                        (e.g., you subscribe many object using a function
         *                        that lives on the prototype)
         * @return {boolean} true if the subscriber was found and detached.
         */
        unsubscribe: function(type, fn, context) {

            // If this is a
            if (Y.lang.isObject(type) && type.detach) {
                return type.detach();
            }

            this.__yui_events = this.__yui_events || {};
            var evts = this.__yui_events;
            if (type) {
                var ce = evts[type];
                if (ce) {
                    return ce.unsubscribe(fn, context);
                }
            } else {
                var ret = true;
                for (var i in evts) {
                    if (Y.object.owns(evts, i)) {
                        ret = ret && evts[i].unsubscribe(fn, context);
                    }
                }
                return ret;
            }

            return false;
        },
        
        /**
         * Removes all listeners from the specified event.  If the event type
         * is not specified, all listeners from all hosted custom events will
         * be removed.
         * @method unsubscribeAll
         * @param type {string}   The type, or name of the event
         */
        unsubscribeAll: function(type) {
            return this.unsubscribe(type);
        },

        /**
         * Creates a new custom event of the specified type.  If a custom event
         * by that name already exists, it will not be re-created.  In either
         * case the custom event is returned. 
         *
         * @method publish
         *
         * @param type {string} the type, or name of the event
         * @param opts {object} optional config params.  Valid properties are:
         *
         *  <ul>
         *    <li>
         *      context: defines the default execution context.  If not defined
         *      the default context will be this instance.
         *    </li>
         *    <li>
         *      silent: if true, the custom event will not generate log messages.
         *      This is false by default.
         *    </li>
         *    <li>
         *      onSubscribeCallback: specifies a callback to execute when the
         *      event has a new subscriber.  This will fire immediately for
         *      each queued subscriber if any exist prior to the creation of
         *      the event.
         *    </li>
         *  </ul>
         *
         *  @return {Event.Custom} the custom event
         *
         */
        publish: function(type, opts) {

            this.__yui_events = this.__yui_events || {};

            var o = opts || {}, events = this.__yui_events, ce = events[type];

            if (ce) {
                Y.log("publish() skipped: '"+type+"' exists");

                // update config for the event
                ce.applyConfig(o, true);

            } else {

                // apply defaults
                Y.mix(o, {
                    context: this,
                    host: this
                })

                ce = new Y.CustomEvent(type, o);

                events[type] = ce;

                if (o.onSubscribeCallback) {
                    ce.subscribeEvent.subscribe(o.onSubscribeCallback);
                }

            }

            return events[type];
        },

        /**
         * Registers another Event.Target as a bubble target.  Bubble order
         * is determined by the order registered.  Multiple targets can
         * be specified.
         * @method addTarget
         * @param o {Event.Target} the target to add
         */
        addTarget: function(o) {
            this.__yui_targets = this.__yui_targets || {};
            this.__yui_targets[Y.stamp(o)] = o;
        },

        /**
         * Removes a bubble target
         * @method removeTarget
         * @param o {Event.Target} the target to remove
         */
        removeTarget: function(o) {
            delete this.__yui_targets[Y.stamp(o)];
        },

       /**
         * Fire a custom event by name.  The callback functions will be executed
         * from the context specified when the event was created, and with the 
         * following parameters:
         *   <ul>
         *   <li>The first argument fire() was executed with</li>
         *   <li>The custom object (if any) that was passed into the subscribe() 
         *       method</li>
         *   </ul>
         * If the custom event object hasn't been created, then the event hasn't 
         * been published and it has no subscribers.  For performance sake, we 
         * immediate exit in this case.  This means the event won't bubble, so 
         * if the intention is that a bubble target be notified, the event must 
         * be published on this object first.
         *
         * @method fire
         * @param type    {string}  the type, or name of the event
         * @param arguments {Object*} an arbitrary set of parameters to pass to 
         *                            the handler.
         * @return {boolean} the return value from Event.Custom.fire
         *                   
         */
        fire: function(type) {

            this.__yui_events = this.__yui_events || {};
            var ce = this.getEvent(type);
            if (!ce) {
                return true;
            }

            // the originalTarget is what the listener was bound to
            ce.originalTarget = this;

            // the target is what started the bubble.  this will be
            // null unless set in bubble(), in which case this event
            // is the target.
            if (!ce.target) {
                ce.target = this;
            }

            var a = Y.array(arguments, 1, true);

            var ret = ce.fire.apply(ce, a);

            // clear target for next fire()
            ce.target = null;

            return ret;
        },

        /**
         * Returns the custom event of the provided type has been created, a
         * falsy value otherwise
         * @method getEvent
         * @param type {string} the type, or name of the event
         * @return {Event.Target} the custom event or a falsy value
         */
        getEvent: function(type) {
            var e = this.__yui_events;
            return (e && e[type]);
        },

        /**
         * Propagate an event
         * @method bubble
         * @param evt {Event.Custom} the custom event to propagate
         * @return {boolean} the aggregated return value from Event.Custom.fire
         */
        bubble: function(evt) {

            var targs = this.__yui_targets, ret = true;

            if (!evt.stopped && targs) {
                for (var i in targs) {
                    // @TODO need to provide the event target to the bubble target

                    var t = targs[i], type = evt.type,
                        ce = t.getEvent(type) || t.publish(type);

                    ce.target = evt.target;

                    ret = ret && ce.fire.apply(ce, evt.details);

                    // stopPropagation()
                    if (ce.stopped) {
                        break;
                    }
                }
            }

            return ret;
        },

        /**
         * Executes the callback before the given event or
         * method hosted on this object.
         *
         * The signature differs based upon the type of
         * item that is being wrapped.
         *
         * Custom Event: type, callback, context, 1-n additional arguments
         * to append to the callback's argument list.
         *
         * Method: callback, object, methodName, context, 1-n additional 
         * arguments to append to the callback's argument list.
         *
         * @method before
         * @return the detach handle
         */
        before: function() {

            var a = Y.array(arguments, 0, true);

            // insert this object as method target
            a.splice(1, 0, this);

            // Y.log('ET:before- ' + Y.lang.dump(a));

            return Y.before.apply(Y, a);
        },

        /**
         * Executes the callback after the given event or
         * method hosted on this object.
         *
         * The signature differs based upon the type of
         * item that is being wrapped.
         *
         * Custom Event: type, callback, context, 1-n additional arguments
         * to append to the callback's argument list.
         *
         * Method: callback, object, methodName, context, 1-n additional 
         * arguments to append to the callback's argument list.
         *
         * @method after
         * @return the detach handle
         */
        after: function() {
            var a = Y.array(arguments, 0, true);
            a.splice(1, 0, this);
            return Y.after.apply(Y, a);
        }

    };

    Y.mix(Y, Y.EventTarget.prototype);

}, "3.0.0");
