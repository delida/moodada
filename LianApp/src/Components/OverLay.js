
'use strict';

import React, {Component} from 'react';
import {View, Image, ScrollView, TouchableWithoutFeedback, Dimensions} from 'react-native';

import {Theme, NavigationPage, ListRow, Overlay, Label, Button, Checkbox} from 'teaset';

export default class OverlayExample extends NavigationPage {
  static showDefault(transparent, modal, text) {
    let overlayView = (
      <Overlay.View
        style={{alignItems: 'center', justifyContent: 'center'}}
        modal={modal}
        overlayOpacity={transparent ? 0 : null}
        ref={v => this.overlayView = v}
        >
        <View style={{backgroundColor: transparent ? '#333' : Theme.defaultColor, padding: 40, borderRadius: 15, alignItems: 'center'}}>
          <Label  type='danger' size='md' text={text} />
          {modal ? <View style={{height: 20}} /> : null}
          {modal ? <Button title='Close' onPress={() => this.overlayView && this.overlayView.close()} /> : null}
        </View>
      </Overlay.View>
    );
    Overlay.show(overlayView);
  }
}