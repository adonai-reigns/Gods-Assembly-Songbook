import { useState, useEffect, useRef } from 'react';

interface UseKeypressOptions {
    ignoreTypingDelay: number;
    longpressDelay: number;
    suppressKeyDefaults: string[];
}

export const UseKeypressOptionsDefaults = {
    longpressDelay: 1000,
    ignoreTypingDelay: 100,
    suppressKeyDefaults: []
}

/**
 * useKeyPress hook : listens for keydown/keyup and triggers callback when keydown, keyup and longpress is detected 
 * @param keydownCallback 
 * @param keyupCallback 
 * @param longpressCallback 
 * @param options : object 
 *      - longpressDelay: number of milliseconds after a keydown event before triggering a longpress callback, if the keyup event is not detected first
 *      - ignoreTypingDelay: number of milliseconds defines the minimum time between keystrokes, so to not process fast typing (set to 0 to disable)
 *      - suppressKeyDefaults: string[] list of strings that determine which keydown events to prevent default behaviour (use to suppress browser hotkeys, for example)   
 */
export function useKeyPress(keydownCallback: CallableFunction, keyupCallback: CallableFunction, longpressCallback: CallableFunction, options?: UseKeypressOptions) {

    options = { ...UseKeypressOptionsDefaults, ...(options || {}) };

    const [keysPressed, setKeysPressed] = useState(new Map());
    const [keysLongpressed, setKeysLongpressed] = useState(new Map());
    const keyLongpressedTimeout = useRef<number>();
    const longpressTimeout = options.longpressDelay;
    const ignoreTypingDelay = options.ignoreTypingDelay;
    const suppressKeyDefaults = options.suppressKeyDefaults;

    function triggerLongpress(e: KeyboardEvent) {
        // we don't want to trigger the keyup callback when the keyup event is received
        setKeysLongpressed(_keysLongpressed => (_keysLongpressed.set(e.code, (new Date()).getTime()), _keysLongpressed));

        // notify component of the longpress event
        longpressCallback(e);
    }

    function downHandler(e: KeyboardEvent) {

        // prevent specified keys from triggering default events
        if (suppressKeyDefaults.indexOf(e.code) > -1) {
            e.preventDefault();
        }

        // we only process the first keydown event, not the repeats (if they are holding the key down)
        if (!e.repeat) {

            // ignore if they are typing in rapid succession
            if (ignoreTypingDelay && [...keysPressed.values()].sort()[0] > (new Date()).getTime() - ignoreTypingDelay) {

                // record the timestamp that they key began to be pressed
                setKeysPressed(_keysPressed => (_keysPressed.set(e.code, (new Date()).getTime()), _keysPressed));

            } else {
                // set a timeout to trigger if they are holding the key down for a long time
                clearTimeout(keyLongpressedTimeout.current);
                keyLongpressedTimeout.current = setTimeout(() => triggerLongpress(e), longpressTimeout);

                // record the timestamp that they key began to be pressed
                setKeysPressed(_keysPressed => (_keysPressed.set(e.code, (new Date()).getTime()), _keysPressed));

                // notify component of the keydown event
                keydownCallback(e);
            }
        }
    }

    const upHandler = (e: KeyboardEvent) => {
        // do not allow a longpressed event to trigger after they have stopped pressing the key
        clearTimeout(keyLongpressedTimeout.current);

        if (!keysLongpressed.has(e.code)) {
            // notify component of the keyup event if the longpressed event has not been triggered
            keyupCallback(e);
        }

        // reset state for the next keydown event
        keysLongpressed.delete(e.code);
        keysPressed.delete(e.code);
    }

    useEffect(() => {
        document.addEventListener('keydown', downHandler);
        document.addEventListener('keyup', upHandler);
        return () => {
            document.removeEventListener('keydown', downHandler);
            document.removeEventListener('keyup', upHandler);
            clearTimeout(keyLongpressedTimeout.current);
        };
    }, []);
}
