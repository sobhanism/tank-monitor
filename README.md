# Tank Monitor

A small tank monitoring dashboard built with Vue 3, Quasar, Pinia, TypeScript and Three.js.

## Overview

Tank Monitor is a frontend prototype for monitoring a storage tank through a 3D visualization and a set of operational metrics.

The project demonstrates how mock sensor data flows through a service layer and application state into the UI and 3D visualization.

## Features

- 3D tank visualization using Three.js and GLB
- Simulated tank level updates
- Tank level, temperature and pressure metrics
- Automatic tank status evaluation
- Warning and critical alerts
- Responsive dashboard layout
- Mock service layer simulating API requests

## Architecture

The application follows a simple data flow:

```text
Mock Data
   ↓
tankService
   ↓
Pinia Store
   ↓
tankRules
   ↓
Dashboard
   ├── Metrics
   ├── Status
   ├── Alerts
   └── 3D Tank
```
