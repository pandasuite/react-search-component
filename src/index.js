import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilEnv } from 'recoil';
import { PandaBridgeRoot } from 'pandasuite-bridge-react';
import './index.css';
import App from './App';

// SearchPattern sends its results while it renders. With React 18, recoil 0.7 notifies during that
// render and runs it again, so every search would send its results twice. Keep the end-of-batch
// notifications of recoil 0.3; this must run before the first render.
RecoilEnv.RECOIL_GKS_ENABLED.delete('recoil_sync_external_store');
RecoilEnv.RECOIL_GKS_ENABLED.delete('recoil_suppress_rerender_in_callback');

ReactDOM.render(<PandaBridgeRoot><App /></PandaBridgeRoot>, document.getElementById('root'));
