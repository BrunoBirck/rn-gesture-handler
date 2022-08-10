import React, { useRef } from 'react';
import {Animated, StyleSheet, ImageBackground} from 'react-native';
import Image from './inta-question.png';
import {PanGestureHandler, PinchGestureHandler, RotationGestureHandler, State,} from 'react-native-gesture-handler';



const App = () => {
    const rotationRef = useRef();
    const pinchRef = useRef();
    const dragRef = useRef();

    const _baseScale = new Animated.Value(1);
    const _pinchScale = new Animated.Value(1);
    const _scale = Animated.multiply(_baseScale, _pinchScale);
    let _lastScale = 1;
    
    const _onPinchGestureEvent = Animated.event(
        [{nativeEvent: {scale: _pinchScale}}],
        {useNativeDriver: true}
    );

    const _rotate = new Animated.Value(0);
    const _rotateStr = _rotate.interpolate({
        inputRange: [-100, 100],
        outputRange: ['-100rad', '100rad'],
    });
    let _lastRotate = 0;

    const _onRotateGestureEvent = Animated.event(
        [{nativeEvent: {rotation: _rotate}}],
        {useNativeDriver: true}
    );

    const _translateX = new Animated.Value(1);
    const _translateY = new Animated.Value(1);
    let _lastOffset = {x: 0, y: 0};
    const _onGestureEvent = Animated.event(
        [
            {
                nativeEvent: {
                    translationX: _translateX,
                    translationY: _translateY,
                },
            },
        ],
        {useNativeDriver: true}
    );

    const _onRotateHandlerStateChange = event => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            _lastRotate += event.nativeEvent.rotation;
            _rotate.setOffset(_lastRotate);
            _rotate.setValue(0);
        }
    };
    const _onPinchHandlerStateChange = event => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            _lastScale *= event.nativeEvent.scale;
            _baseScale.setValue(_lastScale);
            _pinchScale.setValue(1);
        }
    };
    const _onHandlerStateChange = event => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            _lastOffset.x += event.nativeEvent.translationX;
            _lastOffset.y += event.nativeEvent.translationY;
            _translateX.setOffset(_lastOffset.x);
            _translateX.setValue(0);
            _translateY.setOffset(_lastOffset.y);
            _translateY.setValue(0);
        }
    };

    return (
        <ImageBackground source={{ uri: 'https://frasesdemaloka.com/wp-content/uploads/2022/04/frases-motivacionais-para-status-930x620.jpg'}} resizeMode="contain" style={styles.image}>
            <PanGestureHandler
            ref={dragRef}
            simultaneousHandlers={[rotationRef, pinchRef]}
            onGestureEvent={_onGestureEvent}
            minPointers={1}
            maxPointers={2}
            avgTouches
            onHandlerStateChange={_onHandlerStateChange}>
                <Animated.View  style={[
                    styles.wrapper,
                    {
                        transform: [
                            {translateX: _translateX},
                            {translateY: _translateY},
                        ],
                    },
                ]}>
                    <RotationGestureHandler
                        ref={rotationRef}
                        simultaneousHandlers={pinchRef}
                        onGestureEvent={_onRotateGestureEvent}
                        onHandlerStateChange={_onRotateHandlerStateChange}>
                        <Animated.View
                            style={[
                                styles.wrapper,
                                {
                                    transform: [
                                        {rotate: _rotateStr},
                                    ],
                                },
                            ]}
                            hitSlop={{top: 100, bottom: 100, left: 100, right: 100}}
                        >
                            <PinchGestureHandler
                                ref={pinchRef}
                                simultaneousHandlers={rotationRef}
                                onGestureEvent={_onPinchGestureEvent}
                                onHandlerStateChange={_onPinchHandlerStateChange}>
                                <Animated.View style={[
                                    styles.container,
                                    {
                                        transform: [
                                            {scale: _scale},
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

export default App;


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