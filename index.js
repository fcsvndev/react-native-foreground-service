/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

'use strict';

import {NativeModules, DeviceEventEmitter} from 'react-native';

const ForegroundServiceModule = NativeModules.VIForegroundService;
var _notifHandlers = new Map();

/**
 * @property {string} channelId - Notification channel id to display notification
 * @property {number} id - Unique notification id
 * @property {string} title - Notification title
 * @property {string} text - Notification text
 * @property {string} icon - Small icon name
 * @property {number} [priority] - Priority of this notification. One of:
 *                              0 - PRIORITY_DEFAULT (by default),
 *                              -1 - PRIORITY_LOW,
 *                              -2 - PRIORITY_MIN,
 *                              1 - PRIORITY_HIGH,
 *                              2- PRIORITY_MAX
 */
const NotificationConfig = {

};

/**
 * @property {string} id - Unique channel ID
 * @property {string} name - Notification channel name
 * @property {string} [description] - Notification channel description
 * @property {number} [importance] - Notification channel importance. One of:
 *                                   1 - 'min',
 *                                   2 - 'low' (by default),
 *                                   3 - 'default',
 *                                   4 - 'high',
 *                                   5 - 'max'.
 * @property {boolean} [enableVibration] - Sets whether notification posted to this channel should vibrate. False by default.
 */
const NotificationChannelConfig = {

};

export default class VIForegroundService {
    /**
     * Create notification channel for foreground service
     *
     * @param {NotificationChannelConfig} channelConfig - Notification channel configuration
     * @return Promise
     */
    static async createNotificationChannel(channelConfig) {
        return await ForegroundServiceModule.createNotificationChannel(channelConfig);
    }

    /**
     * Start foreground service
     * @param {NotificationConfig} notificationConfig - Notification config
     * @return Promise
     */
    static async startService(notificationConfig) {
        return await ForegroundServiceModule.startService(notificationConfig);
    }

    /**
     * Stop foreground service
     *
     * @return Promise
     */
    static async stopService() {
        return await ForegroundServiceModule.stopService();
    }

    static onCreated(handler) {
        const listener = DeviceEventEmitter.addListener(
            'onCreated',
            (notifData) => {
                handler(true);
            }
        );
        _notifHandlers.set(handler, listener);
    }

    static onDestroyed(handler) {
        const listener = DeviceEventEmitter.addListener(
            'onDestroyed',
            (notifData) => {
                handler(true);
            }
        );
        _notifHandlers.set(handler, listener);
    }

    static onForegroundServiceDisplayed(handler) {
        const listener = DeviceEventEmitter.addListener(
            'onForegroundServiceDisplayed',
            (notifData) => {
                handler(true);
            }
        );
        _notifHandlers.set(handler, listener);
    }

    static removeEventListener(handler) {
        const listener = _notifHandlers.get(handler)
        if (listener) {
            listener.remove()
        }
        _notifHandlers.remove(handler)
    }

    static removeEventListeners() {
        for (const [key, value] of _notifHandlers) {
            value.remove();
        }

        _notifHandlers.clear();
    }

    static showNotification(notificationConfig) {
        ForegroundServiceModule.showNotification(notificationConfig);
    }
}


