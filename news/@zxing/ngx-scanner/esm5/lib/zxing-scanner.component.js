/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ArgumentException, BarcodeFormat, DecodeHintType } from '@zxing/library';
import { BrowserMultiFormatContinuousReader } from './browser-multi-format-continuous-reader';
var ZXingScannerComponent = /** @class */ (function () {
    /**
     * Constructor to build the object and do some DI.
     */
    function ZXingScannerComponent() {
        /**
         * How the preview element shoud be fit inside the :host container.
         */
        this.previewFitMode = 'cover';
        // instance based emitters
        this.autostarted = new EventEmitter();
        this.autostarting = new EventEmitter();
        this.torchCompatible = new EventEmitter();
        this.scanSuccess = new EventEmitter();
        this.scanFailure = new EventEmitter();
        this.scanError = new EventEmitter();
        this.scanComplete = new EventEmitter();
        this.camerasFound = new EventEmitter();
        this.camerasNotFound = new EventEmitter();
        this.permissionResponse = new EventEmitter(true);
        this.hasDevices = new EventEmitter();
        this.deviceChange = new EventEmitter();
        this._device = null;
        this._enabled = true;
        this._hints = new Map();
        this.autofocusEnabled = true;
        this.autostart = true;
        this.formats = [BarcodeFormat.QR_CODE];
        // computed data
        this.hasNavigator = typeof navigator !== 'undefined';
        this.isMediaDevicesSuported = this.hasNavigator && !!navigator.mediaDevices;
    }
    Object.defineProperty(ZXingScannerComponent.prototype, "codeReader", {
        /**
         * Exposes the current code reader, so the user can use it's APIs.
         */
        get: /**
         * Exposes the current code reader, so the user can use it's APIs.
         * @return {?}
         */
        function () {
            return this._codeReader;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZXingScannerComponent.prototype, "device", {
        /**
         * User device acessor.
         */
        get: /**
         * User device acessor.
         * @return {?}
         */
        function () {
            return this._device;
        },
        /**
         * User device input
         */
        set: /**
         * User device input
         * @param {?} device
         * @return {?}
         */
        function (device) {
            if (!device && device !== null) {
                throw new ArgumentException('The `device` must be a valid MediaDeviceInfo or null.');
            }
            if (this.isCurrentDevice(device)) {
                console.warn('Setting the same device is not allowed.');
                return;
            }
            if (this.isAutostarting) {
                // do not allow setting devices during auto-start, since it will set one and emit it.
                console.warn('Avoid setting a device during auto-start.');
                return;
            }
            if (!this.hasPermission) {
                console.warn('Permissions not set yet, waiting for them to be set to apply device change.');
                // this.permissionResponse
                //   .pipe(
                //     take(1),
                //     tap(() => console.log(`Permissions set, applying device change${device ? ` (${device.deviceId})` : ''}.`))
                //   )
                //   .subscribe(() => this.device = device);
                // return;
            }
            // in order to change the device the codeReader gotta be reseted
            this._reset();
            this._device = device;
            // if enabled, starts scanning
            if (this._enabled && device !== null) {
                this.scanFromDevice(device.deviceId);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZXingScannerComponent.prototype, "formats", {
        /**
         * Returns all the registered formats.
         */
        get: /**
         * Returns all the registered formats.
         * @return {?}
         */
        function () {
            return this.hints.get(DecodeHintType.POSSIBLE_FORMATS);
        },
        /**
         * Registers formats the scanner should support.
         *
         * @param input BarcodeFormat or case-insensitive string array.
         */
        set: /**
         * Registers formats the scanner should support.
         *
         * @param {?} input BarcodeFormat or case-insensitive string array.
         * @return {?}
         */
        function (input) {
            var _this = this;
            if (typeof input === 'string') {
                throw new Error('Invalid formats, make sure the [formats] input is a binding.');
            }
            // formats may be set from html template as BarcodeFormat or string array
            /** @type {?} */
            var formats = input.map((/**
             * @param {?} f
             * @return {?}
             */
            function (f) { return _this.getBarcodeFormatOrFail(f); }));
            /** @type {?} */
            var hints = this.hints;
            // updates the hints
            hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
            this.hints = hints;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZXingScannerComponent.prototype, "hints", {
        /**
         * Returns all the registered hints.
         */
        get: /**
         * Returns all the registered hints.
         * @return {?}
         */
        function () {
            return this._hints;
        },
        /**
         * Does what it takes to set the hints.
         */
        set: /**
         * Does what it takes to set the hints.
         * @param {?} hints
         * @return {?}
         */
        function (hints) {
            this._hints = hints;
            // @note avoid restarting the code reader when possible
            // new instance with new hints.
            this.restart();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZXingScannerComponent.prototype, "isAutostarting", {
        /**
         *
         */
        set: /**
         *
         * @param {?} state
         * @return {?}
         */
        function (state) {
            this._isAutostarting = state;
            this.autostarting.next(state);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZXingScannerComponent.prototype, "isAutstarting", {
        /**
         *
         */
        get: /**
         *
         * @return {?}
         */
        function () {
            return this._isAutostarting;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZXingScannerComponent.prototype, "torch", {
        /**
         * Allow start scan or not.
         */
        set: /**
         * Allow start scan or not.
         * @param {?} on
         * @return {?}
         */
        function (on) {
            this.getCodeReader().setTorch(on);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZXingScannerComponent.prototype, "enable", {
        /**
         * Allow start scan or not.
         */
        set: /**
         * Allow start scan or not.
         * @param {?} enabled
         * @return {?}
         */
        function (enabled) {
            this._enabled = Boolean(enabled);
            if (!this._enabled) {
                this.reset();
            }
            else if (this.device) {
                this.scanFromDevice(this.device.deviceId);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZXingScannerComponent.prototype, "enabled", {
        /**
         * Tells if the scanner is enabled or not.
         */
        get: /**
         * Tells if the scanner is enabled or not.
         * @return {?}
         */
        function () {
            return this._enabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZXingScannerComponent.prototype, "tryHarder", {
        /**
         * If is `tryHarder` enabled.
         */
        get: /**
         * If is `tryHarder` enabled.
         * @return {?}
         */
        function () {
            return this.hints.get(DecodeHintType.TRY_HARDER);
        },
        /**
         * Enable/disable tryHarder hint.
         */
        set: /**
         * Enable/disable tryHarder hint.
         * @param {?} enable
         * @return {?}
         */
        function (enable) {
            /** @type {?} */
            var hints = this.hints;
            if (enable) {
                hints.set(DecodeHintType.TRY_HARDER, true);
            }
            else {
                hints.delete(DecodeHintType.TRY_HARDER);
            }
            this.hints = hints;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets and registers all cammeras.
     */
    /**
     * Gets and registers all cammeras.
     * @return {?}
     */
    ZXingScannerComponent.prototype.askForPermission = /**
     * Gets and registers all cammeras.
     * @return {?}
     */
    function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var stream, permission, err_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.hasNavigator) {
                            console.error('@zxing/ngx-scanner', 'Can\'t ask permission, navigator is not present.');
                            this.setPermission(null);
                            return [2 /*return*/, this.hasPermission];
                        }
                        if (!this.isMediaDevicesSuported) {
                            console.error('@zxing/ngx-scanner', 'Can\'t get user media, this is not supported.');
                            this.setPermission(null);
                            return [2 /*return*/, this.hasPermission];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, this.getAnyVideoDevice()];
                    case 2:
                        // Will try to ask for permission
                        stream = _a.sent();
                        permission = !!stream;
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _a.sent();
                        return [2 /*return*/, this.handlePermissionException(err_1)];
                    case 4:
                        this.terminateStream(stream);
                        return [7 /*endfinally*/];
                    case 5:
                        this.setPermission(permission);
                        // Returns the permission
                        return [2 /*return*/, permission];
                }
            });
        });
    };
    /**
     *
     */
    /**
     *
     * @return {?}
     */
    ZXingScannerComponent.prototype.getAnyVideoDevice = /**
     *
     * @return {?}
     */
    function () {
        return navigator.mediaDevices.getUserMedia({ video: true });
    };
    /**
     * Terminates a stream and it's tracks.
     */
    /**
     * Terminates a stream and it's tracks.
     * @private
     * @param {?} stream
     * @return {?}
     */
    ZXingScannerComponent.prototype.terminateStream = /**
     * Terminates a stream and it's tracks.
     * @private
     * @param {?} stream
     * @return {?}
     */
    function (stream) {
        if (stream) {
            stream.getTracks().forEach((/**
             * @param {?} t
             * @return {?}
             */
            function (t) { return t.stop(); }));
        }
        stream = undefined;
    };
    /**
     * Initializes the component without starting the scanner.
     */
    /**
     * Initializes the component without starting the scanner.
     * @private
     * @return {?}
     */
    ZXingScannerComponent.prototype.initAutostartOff = /**
     * Initializes the component without starting the scanner.
     * @private
     * @return {?}
     */
    function () {
        // do not ask for permission when autostart is off
        this.isAutostarting = null;
        // just update devices information
        this.updateVideoInputDevices();
    };
    /**
     * Initializes the component and starts the scanner.
     * Permissions are asked to accomplish that.
     */
    /**
     * Initializes the component and starts the scanner.
     * Permissions are asked to accomplish that.
     * @private
     * @return {?}
     */
    ZXingScannerComponent.prototype.initAutostartOn = /**
     * Initializes the component and starts the scanner.
     * Permissions are asked to accomplish that.
     * @private
     * @return {?}
     */
    function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var hasPermission, e_1, devices;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.isAutostarting = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.askForPermission()];
                    case 2:
                        // Asks for permission before enumerating devices so it can get all the device's info
                        hasPermission = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error('Exception occurred while asking for permission:', e_1);
                        return [2 /*return*/];
                    case 4:
                        if (!hasPermission) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.updateVideoInputDevices()];
                    case 5:
                        devices = _a.sent();
                        this.autostartScanner(tslib_1.__spread(devices));
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Checks if the given device is the current defined one.
     */
    /**
     * Checks if the given device is the current defined one.
     * @param {?} device
     * @return {?}
     */
    ZXingScannerComponent.prototype.isCurrentDevice = /**
     * Checks if the given device is the current defined one.
     * @param {?} device
     * @return {?}
     */
    function (device) {
        return this.device && device && device.deviceId === this.device.deviceId;
    };
    /**
     * Executed after the view initialization.
     */
    /**
     * Executed after the view initialization.
     * @return {?}
     */
    ZXingScannerComponent.prototype.ngAfterViewInit = /**
     * Executed after the view initialization.
     * @return {?}
     */
    function () {
        var _this = this;
        // makes torch availability information available to user
        this.getCodeReader().isTorchAvailable.subscribe((/**
         * @param {?} x
         * @return {?}
         */
        function (x) { return _this.torchCompatible.emit(x); }));
        if (!this.autostart) {
            console.warn('New feature \'autostart\' disabled, be careful. Permissions and devices recovery has to be run manually.');
            // does the necessary configuration without autostarting
            this.initAutostartOff();
            return;
        }
        // configurates the component and starts the scanner
        this.initAutostartOn();
    };
    /**
     * Executes some actions before destroy the component.
     */
    /**
     * Executes some actions before destroy the component.
     * @return {?}
     */
    ZXingScannerComponent.prototype.ngOnDestroy = /**
     * Executes some actions before destroy the component.
     * @return {?}
     */
    function () {
        this.reset();
    };
    /**
     * Stops old `codeReader` and starts scanning in a new one.
     */
    /**
     * Stops old `codeReader` and starts scanning in a new one.
     * @return {?}
     */
    ZXingScannerComponent.prototype.restart = /**
     * Stops old `codeReader` and starts scanning in a new one.
     * @return {?}
     */
    function () {
        /** @type {?} */
        var prevDevice = this._reset();
        if (!prevDevice) {
            return;
        }
        // @note apenas necessario por enquanto causa da Torch
        this._codeReader = undefined;
        this.device = prevDevice;
    };
    /**
     * Discovers and updates known video input devices.
     */
    /**
     * Discovers and updates known video input devices.
     * @return {?}
     */
    ZXingScannerComponent.prototype.updateVideoInputDevices = /**
     * Discovers and updates known video input devices.
     * @return {?}
     */
    function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var devices, hasDevices;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // permissions aren't needed to get devices, but to access them and their info
                        return [4 /*yield*/, this.getCodeReader().listVideoInputDevices()];
                    case 1:
                        devices = (_a.sent()) || [];
                        hasDevices = devices && devices.length > 0;
                        // stores discovered devices and updates information
                        this.hasDevices.next(hasDevices);
                        this.camerasFound.next(tslib_1.__spread(devices));
                        if (!hasDevices) {
                            this.camerasNotFound.next();
                        }
                        return [2 /*return*/, devices];
                }
            });
        });
    };
    /**
     * Starts the scanner with the back camera otherwise take the last
     * available device.
     */
    /**
     * Starts the scanner with the back camera otherwise take the last
     * available device.
     * @private
     * @param {?} devices
     * @return {?}
     */
    ZXingScannerComponent.prototype.autostartScanner = /**
     * Starts the scanner with the back camera otherwise take the last
     * available device.
     * @private
     * @param {?} devices
     * @return {?}
     */
    function (devices) {
        /** @type {?} */
        var matcher = (/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var label = _a.label;
            return /back|trás|rear|traseira|environment|ambiente/gi.test(label);
        });
        // select the rear camera by default, otherwise take the last camera.
        /** @type {?} */
        var device = devices.find(matcher) || devices.pop();
        if (!device) {
            throw new Error('Impossible to autostart, no input devices available.');
        }
        this.device = device;
        // @note when listening to this change, callback code will sometimes run before the previous line.
        this.deviceChange.emit(device);
        this.isAutostarting = false;
        this.autostarted.next();
    };
    /**
     * Dispatches the scan success event.
     *
     * @param result the scan result.
     */
    /**
     * Dispatches the scan success event.
     *
     * @private
     * @param {?} result the scan result.
     * @return {?}
     */
    ZXingScannerComponent.prototype.dispatchScanSuccess = /**
     * Dispatches the scan success event.
     *
     * @private
     * @param {?} result the scan result.
     * @return {?}
     */
    function (result) {
        this.scanSuccess.next(result.getText());
    };
    /**
     * Dispatches the scan failure event.
     */
    /**
     * Dispatches the scan failure event.
     * @private
     * @param {?=} reason
     * @return {?}
     */
    ZXingScannerComponent.prototype.dispatchScanFailure = /**
     * Dispatches the scan failure event.
     * @private
     * @param {?=} reason
     * @return {?}
     */
    function (reason) {
        this.scanFailure.next(reason);
    };
    /**
     * Dispatches the scan error event.
     *
     * @param error the error thing.
     */
    /**
     * Dispatches the scan error event.
     *
     * @private
     * @param {?} error the error thing.
     * @return {?}
     */
    ZXingScannerComponent.prototype.dispatchScanError = /**
     * Dispatches the scan error event.
     *
     * @private
     * @param {?} error the error thing.
     * @return {?}
     */
    function (error) {
        this.scanError.next(error);
    };
    /**
     * Dispatches the scan event.
     *
     * @param result the scan result.
     */
    /**
     * Dispatches the scan event.
     *
     * @private
     * @param {?} result the scan result.
     * @return {?}
     */
    ZXingScannerComponent.prototype.dispatchScanComplete = /**
     * Dispatches the scan event.
     *
     * @private
     * @param {?} result the scan result.
     * @return {?}
     */
    function (result) {
        this.scanComplete.next(result);
    };
    /**
     * Returns the filtered permission.
     */
    /**
     * Returns the filtered permission.
     * @private
     * @param {?} err
     * @return {?}
     */
    ZXingScannerComponent.prototype.handlePermissionException = /**
     * Returns the filtered permission.
     * @private
     * @param {?} err
     * @return {?}
     */
    function (err) {
        // failed to grant permission to video input
        console.error('@zxing/ngx-scanner', 'Error when asking for permission.', err);
        /** @type {?} */
        var permission;
        switch (err.name) {
            // usually caused by not secure origins
            case 'NotSupportedError':
                console.warn('@zxing/ngx-scanner', err.message);
                // could not claim
                permission = null;
                // can't check devices
                this.hasDevices.next(null);
                break;
            // user denied permission
            case 'NotAllowedError':
                console.warn('@zxing/ngx-scanner', err.message);
                // claimed and denied permission
                permission = false;
                // this means that input devices exists
                this.hasDevices.next(true);
                break;
            // the device has no attached input devices
            case 'NotFoundError':
                console.warn('@zxing/ngx-scanner', err.message);
                // no permissions claimed
                permission = null;
                // because there was no devices
                this.hasDevices.next(false);
                // tells the listener about the error
                this.camerasNotFound.next(err);
                break;
            case 'NotReadableError':
                console.warn('@zxing/ngx-scanner', 'Couldn\'t read the device(s)\'s stream, it\'s probably in use by another app.');
                // no permissions claimed
                permission = null;
                // there are devices, which I couldn't use
                this.hasDevices.next(false);
                // tells the listener about the error
                this.camerasNotFound.next(err);
                break;
            default:
                console.warn('@zxing/ngx-scanner', 'I was not able to define if I have permissions for camera or not.', err);
                // unknown
                permission = null;
                // this.hasDevices.next(undefined;
                break;
        }
        this.setPermission(permission);
        // tells the listener about the error
        this.permissionResponse.error(err);
        return permission;
    };
    /**
     * Returns a valid BarcodeFormat or fails.
     */
    /**
     * Returns a valid BarcodeFormat or fails.
     * @private
     * @param {?} format
     * @return {?}
     */
    ZXingScannerComponent.prototype.getBarcodeFormatOrFail = /**
     * Returns a valid BarcodeFormat or fails.
     * @private
     * @param {?} format
     * @return {?}
     */
    function (format) {
        return typeof format === 'string'
            ? BarcodeFormat[format.trim().toUpperCase()]
            : format;
    };
    /**
     * Retorna um code reader, cria um se nenhume existe.
     */
    /**
     * Retorna um code reader, cria um se nenhume existe.
     * @private
     * @return {?}
     */
    ZXingScannerComponent.prototype.getCodeReader = /**
     * Retorna um code reader, cria um se nenhume existe.
     * @private
     * @return {?}
     */
    function () {
        if (!this._codeReader) {
            this._codeReader = new BrowserMultiFormatContinuousReader(this.hints);
        }
        return this._codeReader;
    };
    /**
     * Starts the continuous scanning for the given device.
     *
     * @param deviceId The deviceId from the device.
     */
    /**
     * Starts the continuous scanning for the given device.
     *
     * @private
     * @param {?} deviceId The deviceId from the device.
     * @return {?}
     */
    ZXingScannerComponent.prototype.scanFromDevice = /**
     * Starts the continuous scanning for the given device.
     *
     * @private
     * @param {?} deviceId The deviceId from the device.
     * @return {?}
     */
    function (deviceId) {
        var _this = this;
        /** @type {?} */
        var videoElement = this.previewElemRef.nativeElement;
        /** @type {?} */
        var codeReader = this.getCodeReader();
        /** @type {?} */
        var decodingStream = codeReader.continuousDecodeFromInputVideoDevice(deviceId, videoElement);
        if (!decodingStream) {
            throw new Error('Undefined decoding stream, aborting.');
        }
        /** @type {?} */
        var next = (/**
         * @param {?} x
         * @return {?}
         */
        function (x) { return _this._onDecodeResult(x.result, x.error); });
        /** @type {?} */
        var error = (/**
         * @param {?} err
         * @return {?}
         */
        function (err) { return _this._onDecodeError(err); });
        /** @type {?} */
        var complete = (/**
         * @return {?}
         */
        function () { _this.reset(); console.log('completed'); });
        decodingStream.subscribe(next, error, complete);
    };
    /**
     * Handles decode errors.
     */
    /**
     * Handles decode errors.
     * @private
     * @param {?} err
     * @return {?}
     */
    ZXingScannerComponent.prototype._onDecodeError = /**
     * Handles decode errors.
     * @private
     * @param {?} err
     * @return {?}
     */
    function (err) {
        this.dispatchScanError(err);
        this.reset();
    };
    /**
     * Handles decode results.
     */
    /**
     * Handles decode results.
     * @private
     * @param {?} result
     * @param {?} error
     * @return {?}
     */
    ZXingScannerComponent.prototype._onDecodeResult = /**
     * Handles decode results.
     * @private
     * @param {?} result
     * @param {?} error
     * @return {?}
     */
    function (result, error) {
        if (result) {
            this.dispatchScanSuccess(result);
        }
        else {
            this.dispatchScanFailure(error);
        }
        this.dispatchScanComplete(result);
    };
    /**
     * Stops the code reader and returns the previous selected device.
     */
    /**
     * Stops the code reader and returns the previous selected device.
     * @private
     * @return {?}
     */
    ZXingScannerComponent.prototype._reset = /**
     * Stops the code reader and returns the previous selected device.
     * @private
     * @return {?}
     */
    function () {
        if (!this._codeReader) {
            return;
        }
        /** @type {?} */
        var device = this.device;
        // do not set this.device inside this method, it would create a recursive loop
        this._device = null;
        this._codeReader.reset();
        return device;
    };
    /**
     * Resets the scanner and emits device change.
     */
    /**
     * Resets the scanner and emits device change.
     * @return {?}
     */
    ZXingScannerComponent.prototype.reset = /**
     * Resets the scanner and emits device change.
     * @return {?}
     */
    function () {
        this._reset();
        this.deviceChange.emit(null);
    };
    /**
     * Sets the permission value and emmits the event.
     */
    /**
     * Sets the permission value and emmits the event.
     * @private
     * @param {?} hasPermission
     * @return {?}
     */
    ZXingScannerComponent.prototype.setPermission = /**
     * Sets the permission value and emmits the event.
     * @private
     * @param {?} hasPermission
     * @return {?}
     */
    function (hasPermission) {
        this.hasPermission = hasPermission;
        this.permissionResponse.next(hasPermission);
    };
    ZXingScannerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'zxing-scanner',
                    template: "<video #preview [style.object-fit]=\"previewFitMode\">\r\n  <p>\r\n    Your browser does not support this feature, please try to upgrade it.\r\n  </p>\r\n  <p>\r\n    Seu navegador n\u00E3o suporta este recurso, por favor tente atualiz\u00E1-lo.\r\n  </p>\r\n</video>\r\n",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: [":host{display:block}video{width:100%;height:auto;-o-object-fit:contain;object-fit:contain}"]
                }] }
    ];
    /** @nocollapse */
    ZXingScannerComponent.ctorParameters = function () { return []; };
    ZXingScannerComponent.propDecorators = {
        previewElemRef: [{ type: ViewChild, args: ['preview', { static: true },] }],
        autofocusEnabled: [{ type: Input }],
        autostarted: [{ type: Output }],
        autostarting: [{ type: Output }],
        autostart: [{ type: Input }],
        previewFitMode: [{ type: Input }],
        torchCompatible: [{ type: Output }],
        scanSuccess: [{ type: Output }],
        scanFailure: [{ type: Output }],
        scanError: [{ type: Output }],
        scanComplete: [{ type: Output }],
        camerasFound: [{ type: Output }],
        camerasNotFound: [{ type: Output }],
        permissionResponse: [{ type: Output }],
        hasDevices: [{ type: Output }],
        device: [{ type: Input }],
        deviceChange: [{ type: Output }],
        formats: [{ type: Input }],
        torch: [{ type: Input }],
        enable: [{ type: Input }],
        tryHarder: [{ type: Input }]
    };
    return ZXingScannerComponent;
}());
export { ZXingScannerComponent };
if (false) {
    /**
     * Supported Hints map.
     * @type {?}
     * @private
     */
    ZXingScannerComponent.prototype._hints;
    /**
     * The ZXing code reader.
     * @type {?}
     * @private
     */
    ZXingScannerComponent.prototype._codeReader;
    /**
     * The device that should be used to scan things.
     * @type {?}
     * @private
     */
    ZXingScannerComponent.prototype._device;
    /**
     * The device that should be used to scan things.
     * @type {?}
     * @private
     */
    ZXingScannerComponent.prototype._enabled;
    /**
     *
     * @type {?}
     * @private
     */
    ZXingScannerComponent.prototype._isAutostarting;
    /**
     * Has `navigator` access.
     * @type {?}
     * @private
     */
    ZXingScannerComponent.prototype.hasNavigator;
    /**
     * Says if some native API is supported.
     * @type {?}
     * @private
     */
    ZXingScannerComponent.prototype.isMediaDevicesSuported;
    /**
     * If the user-agent allowed the use of the camera or not.
     * @type {?}
     * @private
     */
    ZXingScannerComponent.prototype.hasPermission;
    /**
     * Reference to the preview element, should be the `video` tag.
     * @type {?}
     */
    ZXingScannerComponent.prototype.previewElemRef;
    /**
     * Enable or disable autofocus of the camera (might have an impact on performance)
     * @type {?}
     */
    ZXingScannerComponent.prototype.autofocusEnabled;
    /**
     * Emits when and if the scanner is autostarted.
     * @type {?}
     */
    ZXingScannerComponent.prototype.autostarted;
    /**
     * True during autostart and false after. It will be null if won't autostart at all.
     * @type {?}
     */
    ZXingScannerComponent.prototype.autostarting;
    /**
     * If the scanner should autostart with the first available device.
     * @type {?}
     */
    ZXingScannerComponent.prototype.autostart;
    /**
     * How the preview element shoud be fit inside the :host container.
     * @type {?}
     */
    ZXingScannerComponent.prototype.previewFitMode;
    /**
     * Emitts events when the torch compatibility is changed.
     * @type {?}
     */
    ZXingScannerComponent.prototype.torchCompatible;
    /**
     * Emitts events when a scan is successful performed, will inject the string value of the QR-code to the callback.
     * @type {?}
     */
    ZXingScannerComponent.prototype.scanSuccess;
    /**
     * Emitts events when a scan fails without errors, usefull to know how much scan tries where made.
     * @type {?}
     */
    ZXingScannerComponent.prototype.scanFailure;
    /**
     * Emitts events when a scan throws some error, will inject the error to the callback.
     * @type {?}
     */
    ZXingScannerComponent.prototype.scanError;
    /**
     * Emitts events when a scan is performed, will inject the Result value of the QR-code scan (if available) to the callback.
     * @type {?}
     */
    ZXingScannerComponent.prototype.scanComplete;
    /**
     * Emitts events when no cameras are found, will inject an exception (if available) to the callback.
     * @type {?}
     */
    ZXingScannerComponent.prototype.camerasFound;
    /**
     * Emitts events when no cameras are found, will inject an exception (if available) to the callback.
     * @type {?}
     */
    ZXingScannerComponent.prototype.camerasNotFound;
    /**
     * Emitts events when the users answers for permission.
     * @type {?}
     */
    ZXingScannerComponent.prototype.permissionResponse;
    /**
     * Emitts events when has devices status is update.
     * @type {?}
     */
    ZXingScannerComponent.prototype.hasDevices;
    /**
     * Emits when the current device is changed.
     * @type {?}
     */
    ZXingScannerComponent.prototype.deviceChange;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoienhpbmctc2Nhbm5lci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Aenhpbmcvbmd4LXNjYW5uZXIvIiwic291cmNlcyI6WyJsaWIvenhpbmctc2Nhbm5lci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFFTCxNQUFNLEVBQ04sU0FBUyxFQUVWLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFDTCxpQkFBaUIsRUFDakIsYUFBYSxFQUNiLGNBQWMsRUFHZixNQUFNLGdCQUFnQixDQUFDO0FBRXhCLE9BQU8sRUFBRSxrQ0FBa0MsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBRzlGO0lBZ1VFOztPQUVHO0lBQ0g7Ozs7UUFqUEEsbUJBQWMsR0FBeUQsT0FBTyxDQUFDO1FBa1A3RSwwQkFBMEI7UUFDMUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksWUFBWSxDQUFD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aEMsdUNBQWdEOzs7Ozs7SUFLaEQsNENBQXdEOzs7Ozs7SUFLeEQsd0NBQWlDOzs7Ozs7SUFLakMseUNBQTBCOzs7Ozs7SUFLMUIsZ0RBQWlDOzs7Ozs7SUFLakMsNkNBQThCOzs7Ozs7SUFLOUIsdURBQXdDOzs7Ozs7SUFLeEMsOENBQXNDOzs7OztJQUt0QywrQ0FDNkM7Ozs7O0lBSzdDLGlEQUMwQjs7Ozs7SUFLMUIsNENBQ2dDOzs7OztJQUtoQyw2Q0FDMkM7Ozs7O0lBSzNDLDBDQUNtQjs7Ozs7SUFLbkIsK0NBQytFOzs7OztJQUsvRSxnREFDdUM7Ozs7O0lBS3ZDLDRDQUNrQzs7Ozs7SUFLbEMsNENBQ2lEOzs7OztJQUtqRCwwQ0FDK0I7Ozs7O0lBSy9CLDZDQUNtQzs7Ozs7SUFLbkMsNkNBQzhDOzs7OztJQUs5QyxnREFDbUM7Ozs7O0lBS25DLG1EQUMwQzs7Ozs7SUFLMUMsMkNBQ2tDOzs7OztJQXVEbEMsNkNBQzRDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBBZnRlclZpZXdJbml0LFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxyXG4gIENvbXBvbmVudCxcclxuICBFbGVtZW50UmVmLFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBJbnB1dCxcclxuICBPbkRlc3Ryb3ksXHJcbiAgT3V0cHV0LFxyXG4gIFZpZXdDaGlsZCxcclxuICBOZ1pvbmVcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7XHJcbiAgQXJndW1lbnRFeGNlcHRpb24sXHJcbiAgQmFyY29kZUZvcm1hdCxcclxuICBEZWNvZGVIaW50VHlwZSxcclxuICBFeGNlcHRpb24sXHJcbiAgUmVzdWx0XHJcbn0gZnJvbSAnQHp4aW5nL2xpYnJhcnknO1xyXG5cclxuaW1wb3J0IHsgQnJvd3Nlck11bHRpRm9ybWF0Q29udGludW91c1JlYWRlciB9IGZyb20gJy4vYnJvd3Nlci1tdWx0aS1mb3JtYXQtY29udGludW91cy1yZWFkZXInO1xyXG5pbXBvcnQgeyBSZXN1bHRBbmRFcnJvciB9IGZyb20gJy4vUmVzdWx0QW5kRXJyb3InO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICd6eGluZy1zY2FubmVyJyxcclxuICB0ZW1wbGF0ZVVybDogJy4venhpbmctc2Nhbm5lci5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4venhpbmctc2Nhbm5lci5jb21wb25lbnQuc2NzcyddLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBaWGluZ1NjYW5uZXJDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xyXG5cclxuICAvKipcclxuICAgKiBTdXBwb3J0ZWQgSGludHMgbWFwLlxyXG4gICAqL1xyXG4gIHByaXZhdGUgX2hpbnRzOiBNYXA8RGVjb2RlSGludFR5cGUsIGFueT4gfCBudWxsO1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgWlhpbmcgY29kZSByZWFkZXIuXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBfY29kZVJlYWRlcjogQnJvd3Nlck11bHRpRm9ybWF0Q29udGludW91c1JlYWRlcjtcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIGRldmljZSB0aGF0IHNob3VsZCBiZSB1c2VkIHRvIHNjYW4gdGhpbmdzLlxyXG4gICAqL1xyXG4gIHByaXZhdGUgX2RldmljZTogTWVkaWFEZXZpY2VJbmZvO1xyXG5cclxuICAvKipcclxuICAgKiBUaGUgZGV2aWNlIHRoYXQgc2hvdWxkIGJlIHVzZWQgdG8gc2NhbiB0aGluZ3MuXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBfZW5hYmxlZDogYm9vbGVhbjtcclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKi9cclxuICBwcml2YXRlIF9pc0F1dG9zdGFydGluZzogYm9vbGVhbjtcclxuXHJcbiAgLyoqXHJcbiAgICogSGFzIGBuYXZpZ2F0b3JgIGFjY2Vzcy5cclxuICAgKi9cclxuICBwcml2YXRlIGhhc05hdmlnYXRvcjogYm9vbGVhbjtcclxuXHJcbiAgLyoqXHJcbiAgICogU2F5cyBpZiBzb21lIG5hdGl2ZSBBUEkgaXMgc3VwcG9ydGVkLlxyXG4gICAqL1xyXG4gIHByaXZhdGUgaXNNZWRpYURldmljZXNTdXBvcnRlZDogYm9vbGVhbjtcclxuXHJcbiAgLyoqXHJcbiAgICogSWYgdGhlIHVzZXItYWdlbnQgYWxsb3dlZCB0aGUgdXNlIG9mIHRoZSBjYW1lcmEgb3Igbm90LlxyXG4gICAqL1xyXG4gIHByaXZhdGUgaGFzUGVybWlzc2lvbjogYm9vbGVhbiB8IG51bGw7XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlZmVyZW5jZSB0byB0aGUgcHJldmlldyBlbGVtZW50LCBzaG91bGQgYmUgdGhlIGB2aWRlb2AgdGFnLlxyXG4gICAqL1xyXG4gIEBWaWV3Q2hpbGQoJ3ByZXZpZXcnLCB7IHN0YXRpYzogdHJ1ZSB9KVxyXG4gIHByZXZpZXdFbGVtUmVmOiBFbGVtZW50UmVmPEhUTUxWaWRlb0VsZW1lbnQ+O1xyXG5cclxuICAvKipcclxuICAgKiBFbmFibGUgb3IgZGlzYWJsZSBhdXRvZm9jdXMgb2YgdGhlIGNhbWVyYSAobWlnaHQgaGF2ZSBhbiBpbXBhY3Qgb24gcGVyZm9ybWFuY2UpXHJcbiAgICovXHJcbiAgQElucHV0KClcclxuICBhdXRvZm9jdXNFbmFibGVkOiBib29sZWFuO1xyXG5cclxuICAvKipcclxuICAgKiBFbWl0cyB3aGVuIGFuZCBpZiB0aGUgc2Nhbm5lciBpcyBhdXRvc3RhcnRlZC5cclxuICAgKi9cclxuICBAT3V0cHV0KClcclxuICBhdXRvc3RhcnRlZDogRXZlbnRFbWl0dGVyPHZvaWQ+O1xyXG5cclxuICAvKipcclxuICAgKiBUcnVlIGR1cmluZyBhdXRvc3RhcnQgYW5kIGZhbHNlIGFmdGVyLiBJdCB3aWxsIGJlIG51bGwgaWYgd29uJ3QgYXV0b3N0YXJ0IGF0IGFsbC5cclxuICAgKi9cclxuICBAT3V0cHV0KClcclxuICBhdXRvc3RhcnRpbmc6IEV2ZW50RW1pdHRlcjxib29sZWFuIHwgbnVsbD47XHJcblxyXG4gIC8qKlxyXG4gICAqIElmIHRoZSBzY2FubmVyIHNob3VsZCBhdXRvc3RhcnQgd2l0aCB0aGUgZmlyc3QgYXZhaWxhYmxlIGRldmljZS5cclxuICAgKi9cclxuICBASW5wdXQoKVxyXG4gIGF1dG9zdGFydDogYm9vbGVhbjtcclxuXHJcbiAgLyoqXHJcbiAgICogSG93IHRoZSBwcmV2aWV3IGVsZW1lbnQgc2hvdWQgYmUgZml0IGluc2lkZSB0aGUgOmhvc3QgY29udGFpbmVyLlxyXG4gICAqL1xyXG4gIEBJbnB1dCgpXHJcbiAgcHJldmlld0ZpdE1vZGU6ICdmaWxsJyB8ICdjb250YWluJyB8ICdjb3ZlcicgfCAnc2NhbGUtZG93bicgfCAnbm9uZScgPSAnY292ZXInO1xyXG5cclxuICAvKipcclxuICAgKiBFbWl0dHMgZXZlbnRzIHdoZW4gdGhlIHRvcmNoIGNvbXBhdGliaWxpdHkgaXMgY2hhbmdlZC5cclxuICAgKi9cclxuICBAT3V0cHV0KClcclxuICB0b3JjaENvbXBhdGlibGU6IEV2ZW50RW1pdHRlcjxib29sZWFuPjtcclxuXHJcbiAgLyoqXHJcbiAgICogRW1pdHRzIGV2ZW50cyB3aGVuIGEgc2NhbiBpcyBzdWNjZXNzZnVsIHBlcmZvcm1lZCwgd2lsbCBpbmplY3QgdGhlIHN0cmluZyB2YWx1ZSBvZiB0aGUgUVItY29kZSB0byB0aGUgY2FsbGJhY2suXHJcbiAgICovXHJcbiAgQE91dHB1dCgpXHJcbiAgc2NhblN1Y2Nlc3M6IEV2ZW50RW1pdHRlcjxzdHJpbmc+O1xyXG5cclxuICAvKipcclxuICAgKiBFbWl0dHMgZXZlbnRzIHdoZW4gYSBzY2FuIGZhaWxzIHdpdGhvdXQgZXJyb3JzLCB1c2VmdWxsIHRvIGtub3cgaG93IG11Y2ggc2NhbiB0cmllcyB3aGVyZSBtYWRlLlxyXG4gICAqL1xyXG4gIEBPdXRwdXQoKVxyXG4gIHNjYW5GYWlsdXJlOiBFdmVudEVtaXR0ZXI8RXhjZXB0aW9uIHwgdW5kZWZpbmVkPjtcclxuXHJcbiAgLyoqXHJcbiAgICogRW1pdHRzIGV2ZW50cyB3aGVuIGEgc2NhbiB0aHJvd3Mgc29tZSBlcnJvciwgd2lsbCBpbmplY3QgdGhlIGVycm9yIHRvIHRoZSBjYWxsYmFjay5cclxuICAgKi9cclxuICBAT3V0cHV0KClcclxuICBzY2FuRXJyb3I6IEV2ZW50RW1pdHRlcjxFcnJvcj47XHJcblxyXG4gIC8qKlxyXG4gICAqIEVtaXR0cyBldmVudHMgd2hlbiBhIHNjYW4gaXMgcGVyZm9ybWVkLCB3aWxsIGluamVjdCB0aGUgUmVzdWx0IHZhbHVlIG9mIHRoZSBRUi1jb2RlIHNjYW4gKGlmIGF2YWlsYWJsZSkgdG8gdGhlIGNhbGxiYWNrLlxyXG4gICAqL1xyXG4gIEBPdXRwdXQoKVxyXG4gIHNjYW5Db21wbGV0ZTogRXZlbnRFbWl0dGVyPFJlc3VsdD47XHJcblxyXG4gIC8qKlxyXG4gICAqIEVtaXR0cyBldmVudHMgd2hlbiBubyBjYW1lcmFzIGFyZSBmb3VuZCwgd2lsbCBpbmplY3QgYW4gZXhjZXB0aW9uIChpZiBhdmFpbGFibGUpIHRvIHRoZSBjYWxsYmFjay5cclxuICAgKi9cclxuICBAT3V0cHV0KClcclxuICBjYW1lcmFzRm91bmQ6IEV2ZW50RW1pdHRlcjxNZWRpYURldmljZUluZm9bXT47XHJcblxyXG4gIC8qKlxyXG4gICAqIEVtaXR0cyBldmVudHMgd2hlbiBubyBjYW1lcmFzIGFyZSBmb3VuZCwgd2lsbCBpbmplY3QgYW4gZXhjZXB0aW9uIChpZiBhdmFpbGFibGUpIHRvIHRoZSBjYWxsYmFjay5cclxuICAgKi9cclxuICBAT3V0cHV0KClcclxuICBjYW1lcmFzTm90Rm91bmQ6IEV2ZW50RW1pdHRlcjxhbnk+O1xyXG5cclxuICAvKipcclxuICAgKiBFbWl0dHMgZXZlbnRzIHdoZW4gdGhlIHVzZXJzIGFuc3dlcnMgZm9yIHBlcm1pc3Npb24uXHJcbiAgICovXHJcbiAgQE91dHB1dCgpXHJcbiAgcGVybWlzc2lvblJlc3BvbnNlOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj47XHJcblxyXG4gIC8qKlxyXG4gICAqIEVtaXR0cyBldmVudHMgd2hlbiBoYXMgZGV2aWNlcyBzdGF0dXMgaXMgdXBkYXRlLlxyXG4gICAqL1xyXG4gIEBPdXRwdXQoKVxyXG4gIGhhc0RldmljZXM6IEV2ZW50RW1pdHRlcjxib29sZWFuPjtcclxuXHJcbiAgLyoqXHJcbiAgICogRXhwb3NlcyB0aGUgY3VycmVudCBjb2RlIHJlYWRlciwgc28gdGhlIHVzZXIgY2FuIHVzZSBpdCdzIEFQSXMuXHJcbiAgICovXHJcbiAgZ2V0IGNvZGVSZWFkZXIoKTogQnJvd3Nlck11bHRpRm9ybWF0Q29udGludW91c1JlYWRlciB7XHJcbiAgICByZXR1cm4gdGhpcy5fY29kZVJlYWRlcjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVzZXIgZGV2aWNlIGlucHV0XHJcbiAgICovXHJcbiAgQElucHV0KClcclxuICBzZXQgZGV2aWNlKGRldmljZTogTWVkaWFEZXZpY2VJbmZvIHwgbnVsbCkge1xyXG5cclxuICAgIGlmICghZGV2aWNlICYmIGRldmljZSAhPT0gbnVsbCkge1xyXG4gICAgICB0aHJvdyBuZXcgQXJndW1lbnRFeGNlcHRpb24oJ1RoZSBgZGV2aWNlYCBtdXN0IGJlIGEgdmFsaWQgTWVkaWFEZXZpY2VJbmZvIG9yIG51bGwuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuaXNDdXJyZW50RGV2aWNlKGRldmljZSkpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdTZXR0aW5nIHRoZSBzYW1lIGRldmljZSBpcyBub3QgYWxsb3dlZC4nKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmlzQXV0b3N0YXJ0aW5nKSB7XHJcbiAgICAgIC8vIGRvIG5vdCBhbGxvdyBzZXR0aW5nIGRldmljZXMgZHVyaW5nIGF1dG8tc3RhcnQsIHNpbmNlIGl0IHdpbGwgc2V0IG9uZSBhbmQgZW1pdCBpdC5cclxuICAgICAgY29uc29sZS53YXJuKCdBdm9pZCBzZXR0aW5nIGEgZGV2aWNlIGR1cmluZyBhdXRvLXN0YXJ0LicpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLmhhc1Blcm1pc3Npb24pIHtcclxuICAgICAgY29uc29sZS53YXJuKCdQZXJtaXNzaW9ucyBub3Qgc2V0IHlldCwgd2FpdGluZyBmb3IgdGhlbSB0byBiZSBzZXQgdG8gYXBwbHkgZGV2aWNlIGNoYW5nZS4nKTtcclxuICAgICAgLy8gdGhpcy5wZXJtaXNzaW9uUmVzcG9uc2VcclxuICAgICAgLy8gICAucGlwZShcclxuICAgICAgLy8gICAgIHRha2UoMSksXHJcbiAgICAgIC8vICAgICB0YXAoKCkgPT4gY29uc29sZS5sb2coYFBlcm1pc3Npb25zIHNldCwgYXBwbHlpbmcgZGV2aWNlIGNoYW5nZSR7ZGV2aWNlID8gYCAoJHtkZXZpY2UuZGV2aWNlSWR9KWAgOiAnJ30uYCkpXHJcbiAgICAgIC8vICAgKVxyXG4gICAgICAvLyAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5kZXZpY2UgPSBkZXZpY2UpO1xyXG4gICAgICAvLyByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaW4gb3JkZXIgdG8gY2hhbmdlIHRoZSBkZXZpY2UgdGhlIGNvZGVSZWFkZXIgZ290dGEgYmUgcmVzZXRlZFxyXG4gICAgdGhpcy5fcmVzZXQoKTtcclxuXHJcbiAgICB0aGlzLl9kZXZpY2UgPSBkZXZpY2U7XHJcblxyXG4gICAgLy8gaWYgZW5hYmxlZCwgc3RhcnRzIHNjYW5uaW5nXHJcbiAgICBpZiAodGhpcy5fZW5hYmxlZCAmJiBkZXZpY2UgIT09IG51bGwpIHtcclxuICAgICAgdGhpcy5zY2FuRnJvbURldmljZShkZXZpY2UuZGV2aWNlSWQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRW1pdHMgd2hlbiB0aGUgY3VycmVudCBkZXZpY2UgaXMgY2hhbmdlZC5cclxuICAgKi9cclxuICBAT3V0cHV0KClcclxuICBkZXZpY2VDaGFuZ2U6IEV2ZW50RW1pdHRlcjxNZWRpYURldmljZUluZm8+O1xyXG5cclxuICAvKipcclxuICAgKiBVc2VyIGRldmljZSBhY2Vzc29yLlxyXG4gICAqL1xyXG4gIGdldCBkZXZpY2UoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fZGV2aWNlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhbGwgdGhlIHJlZ2lzdGVyZWQgZm9ybWF0cy5cclxuICAgKi9cclxuICBnZXQgZm9ybWF0cygpOiBCYXJjb2RlRm9ybWF0W10ge1xyXG4gICAgcmV0dXJuIHRoaXMuaGludHMuZ2V0KERlY29kZUhpbnRUeXBlLlBPU1NJQkxFX0ZPUk1BVFMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVnaXN0ZXJzIGZvcm1hdHMgdGhlIHNjYW5uZXIgc2hvdWxkIHN1cHBvcnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gaW5wdXQgQmFyY29kZUZvcm1hdCBvciBjYXNlLWluc2Vuc2l0aXZlIHN0cmluZyBhcnJheS5cclxuICAgKi9cclxuICBASW5wdXQoKVxyXG4gIHNldCBmb3JtYXRzKGlucHV0OiBCYXJjb2RlRm9ybWF0W10pIHtcclxuXHJcbiAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZm9ybWF0cywgbWFrZSBzdXJlIHRoZSBbZm9ybWF0c10gaW5wdXQgaXMgYSBiaW5kaW5nLicpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGZvcm1hdHMgbWF5IGJlIHNldCBmcm9tIGh0bWwgdGVtcGxhdGUgYXMgQmFyY29kZUZvcm1hdCBvciBzdHJpbmcgYXJyYXlcclxuICAgIGNvbnN0IGZvcm1hdHMgPSBpbnB1dC5tYXAoZiA9PiB0aGlzLmdldEJhcmNvZGVGb3JtYXRPckZhaWwoZikpO1xyXG5cclxuICAgIGNvbnN0IGhpbnRzID0gdGhpcy5oaW50cztcclxuXHJcbiAgICAvLyB1cGRhdGVzIHRoZSBoaW50c1xyXG4gICAgaGludHMuc2V0KERlY29kZUhpbnRUeXBlLlBPU1NJQkxFX0ZPUk1BVFMsIGZvcm1hdHMpO1xyXG5cclxuICAgIHRoaXMuaGludHMgPSBoaW50cztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYWxsIHRoZSByZWdpc3RlcmVkIGhpbnRzLlxyXG4gICAqL1xyXG4gIGdldCBoaW50cygpIHtcclxuICAgIHJldHVybiB0aGlzLl9oaW50cztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERvZXMgd2hhdCBpdCB0YWtlcyB0byBzZXQgdGhlIGhpbnRzLlxyXG4gICAqL1xyXG4gIHNldCBoaW50cyhoaW50czogTWFwPERlY29kZUhpbnRUeXBlLCBhbnk+KSB7XHJcblxyXG4gICAgdGhpcy5faGludHMgPSBoaW50cztcclxuXHJcbiAgICAvLyBAbm90ZSBhdm9pZCByZXN0YXJ0aW5nIHRoZSBjb2RlIHJlYWRlciB3aGVuIHBvc3NpYmxlXHJcblxyXG4gICAgLy8gbmV3IGluc3RhbmNlIHdpdGggbmV3IGhpbnRzLlxyXG4gICAgdGhpcy5yZXN0YXJ0KCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqL1xyXG4gIHNldCBpc0F1dG9zdGFydGluZyhzdGF0ZTogYm9vbGVhbiB8IG51bGwpIHtcclxuICAgIHRoaXMuX2lzQXV0b3N0YXJ0aW5nID0gc3RhdGU7XHJcbiAgICB0aGlzLmF1dG9zdGFydGluZy5uZXh0KHN0YXRlKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICovXHJcbiAgZ2V0IGlzQXV0c3RhcnRpbmcoKTogYm9vbGVhbiB8IG51bGwge1xyXG4gICAgcmV0dXJuIHRoaXMuX2lzQXV0b3N0YXJ0aW5nO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQWxsb3cgc3RhcnQgc2NhbiBvciBub3QuXHJcbiAgICovXHJcbiAgQElucHV0KClcclxuICBzZXQgdG9yY2gob246IGJvb2xlYW4pIHtcclxuICAgIHRoaXMuZ2V0Q29kZVJlYWRlcigpLnNldFRvcmNoKG9uKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFsbG93IHN0YXJ0IHNjYW4gb3Igbm90LlxyXG4gICAqL1xyXG4gIEBJbnB1dCgpXHJcbiAgc2V0IGVuYWJsZShlbmFibGVkOiBib29sZWFuKSB7XHJcblxyXG4gICAgdGhpcy5fZW5hYmxlZCA9IEJvb2xlYW4oZW5hYmxlZCk7XHJcblxyXG4gICAgaWYgKCF0aGlzLl9lbmFibGVkKSB7XHJcbiAgICAgIHRoaXMucmVzZXQoKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5kZXZpY2UpIHtcclxuICAgICAgdGhpcy5zY2FuRnJvbURldmljZSh0aGlzLmRldmljZS5kZXZpY2VJZCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUZWxscyBpZiB0aGUgc2Nhbm5lciBpcyBlbmFibGVkIG9yIG5vdC5cclxuICAgKi9cclxuICBnZXQgZW5hYmxlZCgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLl9lbmFibGVkO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSWYgaXMgYHRyeUhhcmRlcmAgZW5hYmxlZC5cclxuICAgKi9cclxuICBnZXQgdHJ5SGFyZGVyKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaGludHMuZ2V0KERlY29kZUhpbnRUeXBlLlRSWV9IQVJERVIpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRW5hYmxlL2Rpc2FibGUgdHJ5SGFyZGVyIGhpbnQuXHJcbiAgICovXHJcbiAgQElucHV0KClcclxuICBzZXQgdHJ5SGFyZGVyKGVuYWJsZTogYm9vbGVhbikge1xyXG5cclxuICAgIGNvbnN0IGhpbnRzID0gdGhpcy5oaW50cztcclxuXHJcbiAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgIGhpbnRzLnNldChEZWNvZGVIaW50VHlwZS5UUllfSEFSREVSLCB0cnVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGhpbnRzLmRlbGV0ZShEZWNvZGVIaW50VHlwZS5UUllfSEFSREVSKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmhpbnRzID0gaGludHM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDb25zdHJ1Y3RvciB0byBidWlsZCB0aGUgb2JqZWN0IGFuZCBkbyBzb21lIERJLlxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgLy8gaW5zdGFuY2UgYmFzZWQgZW1pdHRlcnNcclxuICAgIHRoaXMuYXV0b3N0YXJ0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmF1dG9zdGFydGluZyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMudG9yY2hDb21wYXRpYmxlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5zY2FuU3VjY2VzcyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuc2NhbkZhaWx1cmUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLnNjYW5FcnJvciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuc2NhbkNvbXBsZXRlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5jYW1lcmFzRm91bmQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmNhbWVyYXNOb3RGb3VuZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMucGVybWlzc2lvblJlc3BvbnNlID0gbmV3IEV2ZW50RW1pdHRlcih0cnVlKTtcclxuICAgIHRoaXMuaGFzRGV2aWNlcyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuZGV2aWNlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICAgIHRoaXMuX2RldmljZSA9IG51bGw7XHJcbiAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZTtcclxuICAgIHRoaXMuX2hpbnRzID0gbmV3IE1hcDxEZWNvZGVIaW50VHlwZSwgYW55PigpO1xyXG4gICAgdGhpcy5hdXRvZm9jdXNFbmFibGVkID0gdHJ1ZTtcclxuICAgIHRoaXMuYXV0b3N0YXJ0ID0gdHJ1ZTtcclxuICAgIHRoaXMuZm9ybWF0cyA9IFtCYXJjb2RlRm9ybWF0LlFSX0NPREVdO1xyXG5cclxuICAgIC8vIGNvbXB1dGVkIGRhdGFcclxuICAgIHRoaXMuaGFzTmF2aWdhdG9yID0gdHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCc7XHJcbiAgICB0aGlzLmlzTWVkaWFEZXZpY2VzU3Vwb3J0ZWQgPSB0aGlzLmhhc05hdmlnYXRvciAmJiAhIW5hdmlnYXRvci5tZWRpYURldmljZXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIGFuZCByZWdpc3RlcnMgYWxsIGNhbW1lcmFzLlxyXG4gICAqL1xyXG4gIGFzeW5jIGFza0ZvclBlcm1pc3Npb24oKTogUHJvbWlzZTxib29sZWFuPiB7XHJcblxyXG4gICAgaWYgKCF0aGlzLmhhc05hdmlnYXRvcikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdAenhpbmcvbmd4LXNjYW5uZXInLCAnQ2FuXFwndCBhc2sgcGVybWlzc2lvbiwgbmF2aWdhdG9yIGlzIG5vdCBwcmVzZW50LicpO1xyXG4gICAgICB0aGlzLnNldFBlcm1pc3Npb24obnVsbCk7XHJcbiAgICAgIHJldHVybiB0aGlzLmhhc1Blcm1pc3Npb247XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLmlzTWVkaWFEZXZpY2VzU3Vwb3J0ZWQpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignQHp4aW5nL25neC1zY2FubmVyJywgJ0NhblxcJ3QgZ2V0IHVzZXIgbWVkaWEsIHRoaXMgaXMgbm90IHN1cHBvcnRlZC4nKTtcclxuICAgICAgdGhpcy5zZXRQZXJtaXNzaW9uKG51bGwpO1xyXG4gICAgICByZXR1cm4gdGhpcy5oYXNQZXJtaXNzaW9uO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBzdHJlYW06IE1lZGlhU3RyZWFtO1xyXG4gICAgbGV0IHBlcm1pc3Npb246IGJvb2xlYW47XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgLy8gV2lsbCB0cnkgdG8gYXNrIGZvciBwZXJtaXNzaW9uXHJcbiAgICAgIHN0cmVhbSA9IGF3YWl0IHRoaXMuZ2V0QW55VmlkZW9EZXZpY2UoKTtcclxuICAgICAgcGVybWlzc2lvbiA9ICEhc3RyZWFtO1xyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZVBlcm1pc3Npb25FeGNlcHRpb24oZXJyKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHRoaXMudGVybWluYXRlU3RyZWFtKHN0cmVhbSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZXRQZXJtaXNzaW9uKHBlcm1pc3Npb24pO1xyXG5cclxuICAgIC8vIFJldHVybnMgdGhlIHBlcm1pc3Npb25cclxuICAgIHJldHVybiBwZXJtaXNzaW9uO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKi9cclxuICBnZXRBbnlWaWRlb0RldmljZSgpOiBQcm9taXNlPE1lZGlhU3RyZWFtPiB7XHJcbiAgICByZXR1cm4gbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEoeyB2aWRlbzogdHJ1ZSB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRlcm1pbmF0ZXMgYSBzdHJlYW0gYW5kIGl0J3MgdHJhY2tzLlxyXG4gICAqL1xyXG4gIHByaXZhdGUgdGVybWluYXRlU3RyZWFtKHN0cmVhbTogTWVkaWFTdHJlYW0pIHtcclxuXHJcbiAgICBpZiAoc3RyZWFtKSB7XHJcbiAgICAgIHN0cmVhbS5nZXRUcmFja3MoKS5mb3JFYWNoKHQgPT4gdC5zdG9wKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0cmVhbSA9IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEluaXRpYWxpemVzIHRoZSBjb21wb25lbnQgd2l0aG91dCBzdGFydGluZyB0aGUgc2Nhbm5lci5cclxuICAgKi9cclxuICBwcml2YXRlIGluaXRBdXRvc3RhcnRPZmYoKTogdm9pZCB7XHJcblxyXG4gICAgLy8gZG8gbm90IGFzayBmb3IgcGVybWlzc2lvbiB3aGVuIGF1dG9zdGFydCBpcyBvZmZcclxuICAgIHRoaXMuaXNBdXRvc3RhcnRpbmcgPSBudWxsO1xyXG5cclxuICAgIC8vIGp1c3QgdXBkYXRlIGRldmljZXMgaW5mb3JtYXRpb25cclxuICAgIHRoaXMudXBkYXRlVmlkZW9JbnB1dERldmljZXMoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEluaXRpYWxpemVzIHRoZSBjb21wb25lbnQgYW5kIHN0YXJ0cyB0aGUgc2Nhbm5lci5cclxuICAgKiBQZXJtaXNzaW9ucyBhcmUgYXNrZWQgdG8gYWNjb21wbGlzaCB0aGF0LlxyXG4gICAqL1xyXG4gIHByaXZhdGUgYXN5bmMgaW5pdEF1dG9zdGFydE9uKCk6IFByb21pc2U8dm9pZD4ge1xyXG5cclxuICAgIHRoaXMuaXNBdXRvc3RhcnRpbmcgPSB0cnVlO1xyXG5cclxuICAgIGxldCBoYXNQZXJtaXNzaW9uOiBib29sZWFuO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIC8vIEFza3MgZm9yIHBlcm1pc3Npb24gYmVmb3JlIGVudW1lcmF0aW5nIGRldmljZXMgc28gaXQgY2FuIGdldCBhbGwgdGhlIGRldmljZSdzIGluZm9cclxuICAgICAgaGFzUGVybWlzc2lvbiA9IGF3YWl0IHRoaXMuYXNrRm9yUGVybWlzc2lvbigpO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdFeGNlcHRpb24gb2NjdXJyZWQgd2hpbGUgYXNraW5nIGZvciBwZXJtaXNzaW9uOicsIGUpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZnJvbSB0aGlzIHBvaW50LCB0aGluZ3MgZ29ubmEgbmVlZCBwZXJtaXNzaW9uc1xyXG4gICAgaWYgKGhhc1Blcm1pc3Npb24pIHtcclxuICAgICAgY29uc3QgZGV2aWNlcyA9IGF3YWl0IHRoaXMudXBkYXRlVmlkZW9JbnB1dERldmljZXMoKTtcclxuICAgICAgdGhpcy5hdXRvc3RhcnRTY2FubmVyKFsuLi5kZXZpY2VzXSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIGRldmljZSBpcyB0aGUgY3VycmVudCBkZWZpbmVkIG9uZS5cclxuICAgKi9cclxuICBpc0N1cnJlbnREZXZpY2UoZGV2aWNlOiBNZWRpYURldmljZUluZm8pIHtcclxuICAgIHJldHVybiB0aGlzLmRldmljZSAmJiBkZXZpY2UgJiYgZGV2aWNlLmRldmljZUlkID09PSB0aGlzLmRldmljZS5kZXZpY2VJZDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEV4ZWN1dGVkIGFmdGVyIHRoZSB2aWV3IGluaXRpYWxpemF0aW9uLlxyXG4gICAqL1xyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcclxuXHJcbiAgICAvLyBtYWtlcyB0b3JjaCBhdmFpbGFiaWxpdHkgaW5mb3JtYXRpb24gYXZhaWxhYmxlIHRvIHVzZXJcclxuICAgIHRoaXMuZ2V0Q29kZVJlYWRlcigpLmlzVG9yY2hBdmFpbGFibGUuc3Vic2NyaWJlKHggPT4gdGhpcy50b3JjaENvbXBhdGlibGUuZW1pdCh4KSk7XHJcblxyXG4gICAgaWYgKCF0aGlzLmF1dG9zdGFydCkge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ05ldyBmZWF0dXJlIFxcJ2F1dG9zdGFydFxcJyBkaXNhYmxlZCwgYmUgY2FyZWZ1bC4gUGVybWlzc2lvbnMgYW5kIGRldmljZXMgcmVjb3ZlcnkgaGFzIHRvIGJlIHJ1biBtYW51YWxseS4nKTtcclxuXHJcbiAgICAgIC8vIGRvZXMgdGhlIG5lY2Vzc2FyeSBjb25maWd1cmF0aW9uIHdpdGhvdXQgYXV0b3N0YXJ0aW5nXHJcbiAgICAgIHRoaXMuaW5pdEF1dG9zdGFydE9mZigpO1xyXG5cclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNvbmZpZ3VyYXRlcyB0aGUgY29tcG9uZW50IGFuZCBzdGFydHMgdGhlIHNjYW5uZXJcclxuICAgIHRoaXMuaW5pdEF1dG9zdGFydE9uKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFeGVjdXRlcyBzb21lIGFjdGlvbnMgYmVmb3JlIGRlc3Ryb3kgdGhlIGNvbXBvbmVudC5cclxuICAgKi9cclxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgIHRoaXMucmVzZXQoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFN0b3BzIG9sZCBgY29kZVJlYWRlcmAgYW5kIHN0YXJ0cyBzY2FubmluZyBpbiBhIG5ldyBvbmUuXHJcbiAgICovXHJcbiAgcmVzdGFydCgpOiB2b2lkIHtcclxuXHJcbiAgICBjb25zdCBwcmV2RGV2aWNlID0gdGhpcy5fcmVzZXQoKTtcclxuXHJcbiAgICBpZiAoIXByZXZEZXZpY2UpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEBub3RlIGFwZW5hcyBuZWNlc3NhcmlvIHBvciBlbnF1YW50byBjYXVzYSBkYSBUb3JjaFxyXG4gICAgdGhpcy5fY29kZVJlYWRlciA9IHVuZGVmaW5lZDtcclxuICAgIHRoaXMuZGV2aWNlID0gcHJldkRldmljZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERpc2NvdmVycyBhbmQgdXBkYXRlcyBrbm93biB2aWRlbyBpbnB1dCBkZXZpY2VzLlxyXG4gICAqL1xyXG4gIGFzeW5jIHVwZGF0ZVZpZGVvSW5wdXREZXZpY2VzKCk6IFByb21pc2U8TWVkaWFEZXZpY2VJbmZvW10+IHtcclxuXHJcbiAgICAvLyBwZXJtaXNzaW9ucyBhcmVuJ3QgbmVlZGVkIHRvIGdldCBkZXZpY2VzLCBidXQgdG8gYWNjZXNzIHRoZW0gYW5kIHRoZWlyIGluZm9cclxuICAgIGNvbnN0IGRldmljZXMgPSBhd2FpdCB0aGlzLmdldENvZGVSZWFkZXIoKS5saXN0VmlkZW9JbnB1dERldmljZXMoKSB8fCBbXTtcclxuICAgIGNvbnN0IGhhc0RldmljZXMgPSBkZXZpY2VzICYmIGRldmljZXMubGVuZ3RoID4gMDtcclxuXHJcbiAgICAvLyBzdG9yZXMgZGlzY292ZXJlZCBkZXZpY2VzIGFuZCB1cGRhdGVzIGluZm9ybWF0aW9uXHJcbiAgICB0aGlzLmhhc0RldmljZXMubmV4dChoYXNEZXZpY2VzKTtcclxuICAgIHRoaXMuY2FtZXJhc0ZvdW5kLm5leHQoWy4uLmRldmljZXNdKTtcclxuXHJcbiAgICBpZiAoIWhhc0RldmljZXMpIHtcclxuICAgICAgdGhpcy5jYW1lcmFzTm90Rm91bmQubmV4dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBkZXZpY2VzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU3RhcnRzIHRoZSBzY2FubmVyIHdpdGggdGhlIGJhY2sgY2FtZXJhIG90aGVyd2lzZSB0YWtlIHRoZSBsYXN0XHJcbiAgICogYXZhaWxhYmxlIGRldmljZS5cclxuICAgKi9cclxuICBwcml2YXRlIGF1dG9zdGFydFNjYW5uZXIoZGV2aWNlczogTWVkaWFEZXZpY2VJbmZvW10pIHtcclxuXHJcbiAgICBjb25zdCBtYXRjaGVyID0gKHsgbGFiZWwgfSkgPT4gL2JhY2t8dHLDoXN8cmVhcnx0cmFzZWlyYXxlbnZpcm9ubWVudHxhbWJpZW50ZS9naS50ZXN0KGxhYmVsKTtcclxuXHJcbiAgICAvLyBzZWxlY3QgdGhlIHJlYXIgY2FtZXJhIGJ5IGRlZmF1bHQsIG90aGVyd2lzZSB0YWtlIHRoZSBsYXN0IGNhbWVyYS5cclxuICAgIGNvbnN0IGRldmljZSA9IGRldmljZXMuZmluZChtYXRjaGVyKSB8fCBkZXZpY2VzLnBvcCgpO1xyXG5cclxuICAgIGlmICghZGV2aWNlKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW1wb3NzaWJsZSB0byBhdXRvc3RhcnQsIG5vIGlucHV0IGRldmljZXMgYXZhaWxhYmxlLicpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZGV2aWNlID0gZGV2aWNlO1xyXG4gICAgLy8gQG5vdGUgd2hlbiBsaXN0ZW5pbmcgdG8gdGhpcyBjaGFuZ2UsIGNhbGxiYWNrIGNvZGUgd2lsbCBzb21ldGltZXMgcnVuIGJlZm9yZSB0aGUgcHJldmlvdXMgbGluZS5cclxuICAgIHRoaXMuZGV2aWNlQ2hhbmdlLmVtaXQoZGV2aWNlKTtcclxuXHJcbiAgICB0aGlzLmlzQXV0b3N0YXJ0aW5nID0gZmFsc2U7XHJcbiAgICB0aGlzLmF1dG9zdGFydGVkLm5leHQoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERpc3BhdGNoZXMgdGhlIHNjYW4gc3VjY2VzcyBldmVudC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSByZXN1bHQgdGhlIHNjYW4gcmVzdWx0LlxyXG4gICAqL1xyXG4gIHByaXZhdGUgZGlzcGF0Y2hTY2FuU3VjY2VzcyhyZXN1bHQ6IFJlc3VsdCk6IHZvaWQge1xyXG4gICAgdGhpcy5zY2FuU3VjY2Vzcy5uZXh0KHJlc3VsdC5nZXRUZXh0KCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGlzcGF0Y2hlcyB0aGUgc2NhbiBmYWlsdXJlIGV2ZW50LlxyXG4gICAqL1xyXG4gIHByaXZhdGUgZGlzcGF0Y2hTY2FuRmFpbHVyZShyZWFzb24/OiBFeGNlcHRpb24pOiB2b2lkIHtcclxuICAgIHRoaXMuc2NhbkZhaWx1cmUubmV4dChyZWFzb24pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGlzcGF0Y2hlcyB0aGUgc2NhbiBlcnJvciBldmVudC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBlcnJvciB0aGUgZXJyb3IgdGhpbmcuXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBkaXNwYXRjaFNjYW5FcnJvcihlcnJvcjogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLnNjYW5FcnJvci5uZXh0KGVycm9yKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERpc3BhdGNoZXMgdGhlIHNjYW4gZXZlbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcmVzdWx0IHRoZSBzY2FuIHJlc3VsdC5cclxuICAgKi9cclxuICBwcml2YXRlIGRpc3BhdGNoU2NhbkNvbXBsZXRlKHJlc3VsdDogUmVzdWx0KTogdm9pZCB7XHJcbiAgICB0aGlzLnNjYW5Db21wbGV0ZS5uZXh0KHJlc3VsdCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBmaWx0ZXJlZCBwZXJtaXNzaW9uLlxyXG4gICAqL1xyXG4gIHByaXZhdGUgaGFuZGxlUGVybWlzc2lvbkV4Y2VwdGlvbihlcnI6IERPTUV4Y2VwdGlvbik6IGJvb2xlYW4ge1xyXG5cclxuICAgIC8vIGZhaWxlZCB0byBncmFudCBwZXJtaXNzaW9uIHRvIHZpZGVvIGlucHV0XHJcbiAgICBjb25zb2xlLmVycm9yKCdAenhpbmcvbmd4LXNjYW5uZXInLCAnRXJyb3Igd2hlbiBhc2tpbmcgZm9yIHBlcm1pc3Npb24uJywgZXJyKTtcclxuXHJcbiAgICBsZXQgcGVybWlzc2lvbjogYm9vbGVhbjtcclxuXHJcbiAgICBzd2l0Y2ggKGVyci5uYW1lKSB7XHJcblxyXG4gICAgICAvLyB1c3VhbGx5IGNhdXNlZCBieSBub3Qgc2VjdXJlIG9yaWdpbnNcclxuICAgICAgY2FzZSAnTm90U3VwcG9ydGVkRXJyb3InOlxyXG4gICAgICAgIGNvbnNvbGUud2FybignQHp4aW5nL25neC1zY2FubmVyJywgZXJyLm1lc3NhZ2UpO1xyXG4gICAgICAgIC8vIGNvdWxkIG5vdCBjbGFpbVxyXG4gICAgICAgIHBlcm1pc3Npb24gPSBudWxsO1xyXG4gICAgICAgIC8vIGNhbid0IGNoZWNrIGRldmljZXNcclxuICAgICAgICB0aGlzLmhhc0RldmljZXMubmV4dChudWxsKTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIC8vIHVzZXIgZGVuaWVkIHBlcm1pc3Npb25cclxuICAgICAgY2FzZSAnTm90QWxsb3dlZEVycm9yJzpcclxuICAgICAgICBjb25zb2xlLndhcm4oJ0B6eGluZy9uZ3gtc2Nhbm5lcicsIGVyci5tZXNzYWdlKTtcclxuICAgICAgICAvLyBjbGFpbWVkIGFuZCBkZW5pZWQgcGVybWlzc2lvblxyXG4gICAgICAgIHBlcm1pc3Npb24gPSBmYWxzZTtcclxuICAgICAgICAvLyB0aGlzIG1lYW5zIHRoYXQgaW5wdXQgZGV2aWNlcyBleGlzdHNcclxuICAgICAgICB0aGlzLmhhc0RldmljZXMubmV4dCh0cnVlKTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIC8vIHRoZSBkZXZpY2UgaGFzIG5vIGF0dGFjaGVkIGlucHV0IGRldmljZXNcclxuICAgICAgY2FzZSAnTm90Rm91bmRFcnJvcic6XHJcbiAgICAgICAgY29uc29sZS53YXJuKCdAenhpbmcvbmd4LXNjYW5uZXInLCBlcnIubWVzc2FnZSk7XHJcbiAgICAgICAgLy8gbm8gcGVybWlzc2lvbnMgY2xhaW1lZFxyXG4gICAgICAgIHBlcm1pc3Npb24gPSBudWxsO1xyXG4gICAgICAgIC8vIGJlY2F1c2UgdGhlcmUgd2FzIG5vIGRldmljZXNcclxuICAgICAgICB0aGlzLmhhc0RldmljZXMubmV4dChmYWxzZSk7XHJcbiAgICAgICAgLy8gdGVsbHMgdGhlIGxpc3RlbmVyIGFib3V0IHRoZSBlcnJvclxyXG4gICAgICAgIHRoaXMuY2FtZXJhc05vdEZvdW5kLm5leHQoZXJyKTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgJ05vdFJlYWRhYmxlRXJyb3InOlxyXG4gICAgICAgIGNvbnNvbGUud2FybignQHp4aW5nL25neC1zY2FubmVyJywgJ0NvdWxkblxcJ3QgcmVhZCB0aGUgZGV2aWNlKHMpXFwncyBzdHJlYW0sIGl0XFwncyBwcm9iYWJseSBpbiB1c2UgYnkgYW5vdGhlciBhcHAuJyk7XHJcbiAgICAgICAgLy8gbm8gcGVybWlzc2lvbnMgY2xhaW1lZFxyXG4gICAgICAgIHBlcm1pc3Npb24gPSBudWxsO1xyXG4gICAgICAgIC8vIHRoZXJlIGFyZSBkZXZpY2VzLCB3aGljaCBJIGNvdWxkbid0IHVzZVxyXG4gICAgICAgIHRoaXMuaGFzRGV2aWNlcy5uZXh0KGZhbHNlKTtcclxuICAgICAgICAvLyB0ZWxscyB0aGUgbGlzdGVuZXIgYWJvdXQgdGhlIGVycm9yXHJcbiAgICAgICAgdGhpcy5jYW1lcmFzTm90Rm91bmQubmV4dChlcnIpO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBjb25zb2xlLndhcm4oJ0B6eGluZy9uZ3gtc2Nhbm5lcicsICdJIHdhcyBub3QgYWJsZSB0byBkZWZpbmUgaWYgSSBoYXZlIHBlcm1pc3Npb25zIGZvciBjYW1lcmEgb3Igbm90LicsIGVycik7XHJcbiAgICAgICAgLy8gdW5rbm93blxyXG4gICAgICAgIHBlcm1pc3Npb24gPSBudWxsO1xyXG4gICAgICAgIC8vIHRoaXMuaGFzRGV2aWNlcy5uZXh0KHVuZGVmaW5lZDtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZXRQZXJtaXNzaW9uKHBlcm1pc3Npb24pO1xyXG5cclxuICAgIC8vIHRlbGxzIHRoZSBsaXN0ZW5lciBhYm91dCB0aGUgZXJyb3JcclxuICAgIHRoaXMucGVybWlzc2lvblJlc3BvbnNlLmVycm9yKGVycik7XHJcblxyXG4gICAgcmV0dXJuIHBlcm1pc3Npb247XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEgdmFsaWQgQmFyY29kZUZvcm1hdCBvciBmYWlscy5cclxuICAgKi9cclxuICBwcml2YXRlIGdldEJhcmNvZGVGb3JtYXRPckZhaWwoZm9ybWF0OiBzdHJpbmcgfCBCYXJjb2RlRm9ybWF0KTogQmFyY29kZUZvcm1hdCB7XHJcbiAgICByZXR1cm4gdHlwZW9mIGZvcm1hdCA9PT0gJ3N0cmluZydcclxuICAgICAgPyBCYXJjb2RlRm9ybWF0W2Zvcm1hdC50cmltKCkudG9VcHBlckNhc2UoKV1cclxuICAgICAgOiBmb3JtYXQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXRvcm5hIHVtIGNvZGUgcmVhZGVyLCBjcmlhIHVtIHNlIG5lbmh1bWUgZXhpc3RlLlxyXG4gICAqL1xyXG4gIHByaXZhdGUgZ2V0Q29kZVJlYWRlcigpOiBCcm93c2VyTXVsdGlGb3JtYXRDb250aW51b3VzUmVhZGVyIHtcclxuXHJcbiAgICBpZiAoIXRoaXMuX2NvZGVSZWFkZXIpIHtcclxuICAgICAgdGhpcy5fY29kZVJlYWRlciA9IG5ldyBCcm93c2VyTXVsdGlGb3JtYXRDb250aW51b3VzUmVhZGVyKHRoaXMuaGludHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLl9jb2RlUmVhZGVyO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU3RhcnRzIHRoZSBjb250aW51b3VzIHNjYW5uaW5nIGZvciB0aGUgZ2l2ZW4gZGV2aWNlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGRldmljZUlkIFRoZSBkZXZpY2VJZCBmcm9tIHRoZSBkZXZpY2UuXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzY2FuRnJvbURldmljZShkZXZpY2VJZDogc3RyaW5nKTogdm9pZCB7XHJcblxyXG4gICAgY29uc3QgdmlkZW9FbGVtZW50ID0gdGhpcy5wcmV2aWV3RWxlbVJlZi5uYXRpdmVFbGVtZW50O1xyXG5cclxuICAgIGNvbnN0IGNvZGVSZWFkZXIgPSB0aGlzLmdldENvZGVSZWFkZXIoKTtcclxuXHJcbiAgICBjb25zdCBkZWNvZGluZ1N0cmVhbSA9IGNvZGVSZWFkZXIuY29udGludW91c0RlY29kZUZyb21JbnB1dFZpZGVvRGV2aWNlKGRldmljZUlkLCB2aWRlb0VsZW1lbnQpO1xyXG5cclxuICAgIGlmICghZGVjb2RpbmdTdHJlYW0pIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmRlZmluZWQgZGVjb2Rpbmcgc3RyZWFtLCBhYm9ydGluZy4nKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBuZXh0ID0gKHg6IFJlc3VsdEFuZEVycm9yKSA9PiB0aGlzLl9vbkRlY29kZVJlc3VsdCh4LnJlc3VsdCwgeC5lcnJvcik7XHJcbiAgICBjb25zdCBlcnJvciA9IChlcnI6IGFueSkgPT4gdGhpcy5fb25EZWNvZGVFcnJvcihlcnIpO1xyXG4gICAgY29uc3QgY29tcGxldGUgPSAoKSA9PiB7IHRoaXMucmVzZXQoKTsgY29uc29sZS5sb2coJ2NvbXBsZXRlZCcpOyB9O1xyXG5cclxuICAgIGRlY29kaW5nU3RyZWFtLnN1YnNjcmliZShuZXh0LCBlcnJvciwgY29tcGxldGUpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlcyBkZWNvZGUgZXJyb3JzLlxyXG4gICAqL1xyXG4gIHByaXZhdGUgX29uRGVjb2RlRXJyb3IoZXJyOiBhbnkpIHtcclxuICAgIHRoaXMuZGlzcGF0Y2hTY2FuRXJyb3IoZXJyKTtcclxuICAgIHRoaXMucmVzZXQoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXMgZGVjb2RlIHJlc3VsdHMuXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBfb25EZWNvZGVSZXN1bHQocmVzdWx0OiBSZXN1bHQsIGVycm9yOiBFeGNlcHRpb24pOiB2b2lkIHtcclxuXHJcbiAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hTY2FuU3VjY2VzcyhyZXN1bHQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5kaXNwYXRjaFNjYW5GYWlsdXJlKGVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmRpc3BhdGNoU2NhbkNvbXBsZXRlKHJlc3VsdCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTdG9wcyB0aGUgY29kZSByZWFkZXIgYW5kIHJldHVybnMgdGhlIHByZXZpb3VzIHNlbGVjdGVkIGRldmljZS5cclxuICAgKi9cclxuICBwcml2YXRlIF9yZXNldCgpOiBNZWRpYURldmljZUluZm8ge1xyXG5cclxuICAgIGlmICghdGhpcy5fY29kZVJlYWRlcikge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGV2aWNlID0gdGhpcy5kZXZpY2U7XHJcbiAgICAvLyBkbyBub3Qgc2V0IHRoaXMuZGV2aWNlIGluc2lkZSB0aGlzIG1ldGhvZCwgaXQgd291bGQgY3JlYXRlIGEgcmVjdXJzaXZlIGxvb3BcclxuICAgIHRoaXMuX2RldmljZSA9IG51bGw7XHJcblxyXG4gICAgdGhpcy5fY29kZVJlYWRlci5yZXNldCgpO1xyXG5cclxuICAgIHJldHVybiBkZXZpY2U7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXNldHMgdGhlIHNjYW5uZXIgYW5kIGVtaXRzIGRldmljZSBjaGFuZ2UuXHJcbiAgICovXHJcbiAgcHVibGljIHJlc2V0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5fcmVzZXQoKTtcclxuICAgIHRoaXMuZGV2aWNlQ2hhbmdlLmVtaXQobnVsbCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBwZXJtaXNzaW9uIHZhbHVlIGFuZCBlbW1pdHMgdGhlIGV2ZW50LlxyXG4gICAqL1xyXG4gIHByaXZhdGUgc2V0UGVybWlzc2lvbihoYXNQZXJtaXNzaW9uOiBib29sZWFuIHwgbnVsbCk6IHZvaWQge1xyXG4gICAgdGhpcy5oYXNQZXJtaXNzaW9uID0gaGFzUGVybWlzc2lvbjtcclxuICAgIHRoaXMucGVybWlzc2lvblJlc3BvbnNlLm5leHQoaGFzUGVybWlzc2lvbik7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=