import React from 'react';
import {Animated, StyleSheet, ImageBackground} from 'react-native';
import Image from './inta-question.png';
import {PanGestureHandler, PinchGestureHandler, RotationGestureHandler, State,} from 'react-native-gesture-handler';



export class PinchableBox extends React.Component {
    panRef = React.createRef();
    rotationRef = React.createRef();
    pinchRef = React.createRef();
    dragRef = React.createRef();


    constructor(props) {
        super(props);

        this.state = {
            _isMounted: false
        };

        /* Pinching */
        
        this._baseScale = new Animated.Value(1);
        this._pinchScale = new Animated.Value(1);

        this._scale = Animated.multiply(this._baseScale, this._pinchScale);
        this._lastScale = 1;
        this._onPinchGestureEvent = Animated.event(
            [{nativeEvent: {scale: this._pinchScale}}],
            {useNativeDriver: true}
        );

        /* Rotation */
        this._rotate = new Animated.Value(0);
        this._rotateStr = this._rotate.interpolate({
            inputRange: [-100, 100],
            outputRange: ['-100rad', '100rad'],
        });
        this._lastRotate = 0;
        this._onRotateGestureEvent = Animated.event(
            [{nativeEvent: {rotation: this._rotate}}],
            {useNativeDriver: true}
        );

        this._translateX = new Animated.Value(1);
        this._translateY = new Animated.Value(1);

        this._lastOffset = {x: 0, y: 0};
        this._onGestureEvent = Animated.event(
            [
                {
                    nativeEvent: {
                        translationX: this._translateX,
                        translationY: this._translateY,
                    },
                },
            ],
            {useNativeDriver: true}
        );

    }

    _onRotateHandlerStateChange = event => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            this._lastRotate += event.nativeEvent.rotation;
            this._rotate.setOffset(this._lastRotate);
            this._rotate.setValue(0);
        }
    };
    _onPinchHandlerStateChange = event => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            this._lastScale *= event.nativeEvent.scale;
            this._baseScale.setValue(this._lastScale);
            this._pinchScale.setValue(1);
        }
    };
    _onHandlerStateChange = event => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            this._lastOffset.x += event.nativeEvent.translationX;
            this._lastOffset.y += event.nativeEvent.translationY;
            this._translateX.setOffset(this._lastOffset.x);
            this._translateX.setValue(0);
            this._translateY.setOffset(this._lastOffset.y);
            this._translateY.setValue(0);
        }
    };

    render() {
        return (
            <ImageBackground source={{ uri: 'https://frasesdemaloka.com/wp-content/uploads/2022/04/frases-motivacionais-para-status-930x620.jpg'}} resizeMode="contain" style={styles.image}>
                <PanGestureHandler
                ref={this.dragRef}
                simultaneousHandlers={[this.rotationRef, this.pinchRef]}
                onGestureEvent={this._onGestureEvent}
                minPointers={1}
                maxPointers={2}
                avgTouches
                onHandlerStateChange={this._onHandlerStateChange}>
                    <Animated.View  style={[
                        styles.wrapper,
                        {
                            transform: [
                                {translateX: this._translateX},
                                {translateY: this._translateY},
                            ],
                        },
                    ]}>
                        <RotationGestureHandler
                            ref={this.rotationRef}
                            simultaneousHandlers={this.pinchRef}
                            onGestureEvent={this._onRotateGestureEvent}
                            onHandlerStateChange={this._onRotateHandlerStateChange}>
                            <Animated.View
                                style={[
                                    styles.wrapper,
                                    {
                                        transform: [
                                            {rotate: this._rotateStr},
                                        ],
                                    },
                                ]}
                                hitSlop={{top: 100, bottom: 100, left: 100, right: 100}}
                            >
                                <PinchGestureHandler
                                    ref={this.pinchRef}
                                    simultaneousHandlers={this.rotationRef}
                                    onGestureEvent={this._onPinchGestureEvent}
                                    onHandlerStateChange={this._onPinchHandlerStateChange}>
                                    <Animated.View style={[
                                        styles.container,
                                        {
                                            transform: [
                                                {scale: this._scale},
                                            ],
                                        },
                                    ]} collapsable={false}>
                                        {/* <Animated.View style={{ width: 250, height: 300, backgroundColor: '#28b5b5' }} /> */}
                                        <Animated.Image
                                            resizeMode={"contain"}
                                            style={
                                                { width: 250, height: 300 }
                                            }
                                            source={Image}
                                        />
                                    </Animated.View>
                                </PinchGestureHandler>
                            </Animated.View>
                        </RotationGestureHandler>
                    </Animated.View>
                </PanGestureHandler>
            </ImageBackground>
        );
    }
}

export default PinchableBox;


const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
        overflow: 'hidden',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    pinchableImage: {
        backgroundColor: "transparent",
        ...StyleSheet.absoluteFillObject,
    },
    wrapper: {
        flex: 1,
    },
    image: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: '#F5AF3D'
    }
});