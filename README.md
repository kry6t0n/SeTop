# 🌐 Network Topology Visualizer

<div align="center">

A modern, interactive web application for creating, editing, and managing network topologies with real-time validation, device management, and comprehensive connection logic.

[![React](https://img.shields.io/badge/React-18.2+-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org)
[![React Router](https://img.shields.io/badge/React%20Router-v6-orange?logo=react-router)](https://reactrouter.com)
[![ReactFlow](https://img.shields.io/badge/ReactFlow-v11.7-brightgreen?logo=react)](https://reactflow.dev)
[![Vite](https://img.shields.io/badge/Vite-7.1-purple?logo=vite)](https://vitejs.dev)

[Features](#-key-features) • [Quick Start](#-getting-started) • [Architecture](#-architecture)

</div>

## 🎯 Overview

Network Topology Visualizer is an interactive platform designed for network engineers and IT professionals to:
- 🖼️ **Create visual network diagrams** with drag-and-drop interface
- 🔌 **Define connections** between network devices with type-based validation
- 📡 **Manage IP addresses** and subnet masks with network compatibility checking
- 💾 **Save and export** network configurations
- 👥 **Manage access** with role-based authentication
- ✅ **Validate networks** automatically before saving

## ✨ Key Features

### 🎨 Interactive Network Canvas
- Drag-and-drop interface for creating network diagrams
- Real-time node and edge editing with instant updates
- Zoom, pan, and fit-to-view controls
- Responsive design with clean, modern UI
- Custom device node styling

### 🔗 Connection Management

**Three Connection Types** with distinct visual styles:

| Type | Visual | Use Case |
|------|--------|----------|
| **Physical** 🔗 | Blue, solid line | Direct cable connections |
| **Routing** 🛣️ | Purple, dashed line | Inter-subnet routing |
| **Logical** 🔀 | Green, double-dashed | Virtual connections (VLAN/VPN) |

**Three Connection Statuses**:
- **Active** 🟢 - Fully operational (green)
- **Inactive** 🟠 - Not in use (orange, 60% opacity)
- **Error** 🔴 - Connection issue (red with dashing)

### 🖧 Device Management

**Supported Device Types**:
- **Router** 🔄 - Network routing and gateway
- **Switch** 🔀 - LAN switching and port management
- **Server** 🖥️ - Data storage and services
- **Workstation** 💻 - User computers
- **Network** 🌐 - Internet/External networks

**Device Features**:
- IP address assignment with validation
- Subnet mask management (CIDR notation support)
- Auto-generate IP addresses with one click
- Duplicate IP detection and alerts
- Device-specific styling and icons
- Real-time validation with visual feedback

### ✅ Network Validation

**Automatic Validation**:
- Device compatibility checking based on types
- IP subnet compatibility validation (CIDR calculation)
- Network address calculation
- Automatic connection type suggestions
- Duplicate IP detection
- Comprehensive validation on project save
- Real-time error feedback with detailed messages

### 📁 Project Management
- Save network topologies to browser localStorage
- Export projects as JSON files
- Import existing configurations
- Edit and update projects
- Delete projects with confirmation
- View project statistics (nodes, edges, types)

### 👤 Authentication & Authorization
- User login with role-based access control (RBAC)
- Three user roles: Administrator, Engineer, User
- Protected routes based on user role
- Admin panel for user management
- Account page for user settings and project management

## 🏗️ Architecture

This project uses a **monorepo** structure with two main packages:

### Frontend (`/frontend`)
Modern React application with:
- **React 18.2+** - UI library with hooks
- **React Router v6** - Client-side routing
- **ReactFlow v11.7** - Advanced graph visualization
- **Vite v7.1** - Lightning-fast build tool
- **TypeScript 5.9** - Type checking support
- **CSS3** - Modern styling

### UI Library (`/ui-library`)
Reusable component library with:
- **Button** - Customizable button component with variants
- **Modal** - Flexible modal dialog with animations
- **FileUpload** - File upload component with validation
- **NetworkCanvas** - Interactive network topology canvas
- **Toolbar** - Network device toolbar with export/import
- **CustomNode** - Custom network device node component
- **Header** - Navigation header with user info
- **Utils** - Connection logic and export utilities

All components are written in **TypeScript** with full type safety.

## 📦 Getting Started

### Prerequisites
- **Node.js** 16+ (18+ recommended)
- **npm** 8+ or **yarn** 1.22+
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

Этот проект использует **npm workspaces** для управления зависимостями. Установка очень простая:

```bash
# 1. Navigate to the project directory
cd solutions/student-6/NTV

# 2. Install all dependencies (workspaces установят зависимости автоматически)
npm install

# 3. Start development server
npm run dev
```

**Важно:** При использовании workspaces, `npm install` в корневой директории автоматически установит все зависимости для `frontend` и `ui-library`.

Если возникают проблемы с установкой:
1. Убедитесь, что имя пакета в `ui-library/package.json` указано как `"@my-app/ui-library"`
2. Удалите `node_modules` и `package-lock.json` в корне и в подпапках, затем выполните `npm install` заново
3. Проверьте версию Node.js (требуется 16+)

The application will be available at `http://localhost:5173` (Vite default port).

### 🔓 Demo Credentials

Use these credentials to log in and explore all features:

| Username | Password | Role | Access |
|----------|----------|------|--------|
| admin | admin123 | Administrator | Full access, admin panel |
| engineer | engineer123 | Network Engineer | Create and edit topologies |
| user | user123 | Regular User | View-only access |

## 🛠️ Available Commands

### Frontend

```bash
cd frontend

npm run dev              # Start development server with HMR
npm run build            # Build for production with optimizations
npm run preview          # Preview production build locally
npm run lint             # Lint code
npm run lint:fix         # Fix linting errors automatically
npm run test             # Run tests
npm run test:coverage    # Run tests with coverage report
```

### UI Library

```bash
cd ui-library

npm run build            # Build library
npm run lint             # Lint code
npm run lint:fix         # Fix linting errors automatically
npm run test             # Run tests
npm run test:coverage    # Run tests with coverage report (90% threshold)
```

## 📁 Project Structure

```
NTV/
├── 📦 frontend/
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── Login.tsx       # Authentication page
│   │   │   ├── Dashboard.tsx   # Landing page
│   │   │   ├── Editor.tsx      # Main editor page
│   │   │   ├── Account.tsx     # User profile & projects
│   │   │   └── Admin.tsx       # Admin panel
│   │   ├── contexts/           # React contexts
│   │   │   └── AuthContext.tsx # Authentication state
│   │   ├── hooks/              # Custom hooks
│   │   │   └── useLocalStorage.ts
│   │   ├── utils/              # Utility functions
│   │   │   ├── projectService.ts
│   │   │   └── validation.ts
│   │   ├── styles/             # CSS files
│   │   ├── App.tsx             # Root component
│   │   └── main.tsx            # Entry point
│   ├── index.html              # HTML template
│   ├── package.json            # Dependencies
│   ├── vite.config.ts          # Build configuration
│   ├── tsconfig.json           # TypeScript config
│   └── eslint.config.js        # ESLint configuration
│
├── 📚 ui-library/
│   ├── src/
│   │   ├── Button/             # Button component
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   └── Button.test.tsx
│   │   ├── Modal/              # Modal component
│   │   │   ├── Modal.tsx
│   │   │   ├── Modal.css
│   │   │   └── Modal.test.tsx
│   │   ├── FileUpload/        # File upload component
│   │   │   ├── FileUpload.tsx
│   │   │   ├── FileUpload.css
│   │   │   └── FileUpload.test.tsx
│   │   ├── Canvas/             # Network canvas components
│   │   │   ├── NetworkCanvas.tsx
│   │   │   ├── Toolbar.tsx
│   │   │   └── CustomNodes/
│   │   │       └── CustomNode.tsx
│   │   ├── Layout/             # Layout components
│   │   │   └── Header.tsx
│   │   ├── utils/              # Utility functions
│   │   │   ├── connectionLogic.ts
│   │   │   └── exportUtils.ts
│   │   ├── index.ts            # Component exports
│   │   └── setupTests.ts      # Test setup
│   ├── package.json            # Library config
│   ├── tsconfig.json           # TypeScript config
│   ├── jest.config.ts         # Jest configuration
│   └── eslint.config.js       # ESLint configuration
│
├── photo_of_site/              # Screenshots
│   ├── image1.png
│   ├── image2.png
│   ├── image3.png
│   └── image4.png
│
└── README.md                    # This file
```

## 🧪 Testing

The project includes comprehensive test coverage:

- **UI Library**: All components have unit tests with 90%+ coverage threshold
- **Frontend**: Tests for utility functions and validation logic
- **Test Framework**: Jest with React Testing Library
- **Coverage**: Run `npm run test:coverage` to see coverage reports

## 📸 Screenshots

Screenshots of the application are available in the `photo_of_site/` directory:
- `image1.png` - Dashboard view
- `image2.png` - Network editor
- `image3.png` - Project management
- `image4.png` - Admin panel

## 🔄 Workflow Example

1. **Login** with demo credentials
2. **Navigate to Editor** to create a new network topology
3. **Add Devices** by clicking device type buttons in the toolbar
4. **Configure Devices** with IP addresses and subnet masks
5. **Create Connections** by dragging from one device to another
6. **Validate and Save** - System checks compatibility and saves to localStorage
7. **Export Project** - Download as JSON for backup or sharing
8. **View Projects** - Go to Account page to manage all saved topologies

## 🧠 Connection Logic Details

### Device Compatibility

The system prevents invalid connections based on device types:
- **Physical connections** work between: Router↔Switch, Switch↔Server, Switch↔Workstation, Any↔Network
- **Routing connections** work between: Router↔Router, Router↔Network
- **Logical connections** work between any devices with IP addresses

### IP Subnet Validation

When connecting devices (excluding Router and Network):
- IP addresses must be in the same subnet
- Subnet masks must be compatible using CIDR notation
- Examples:
  - ✅ `192.168.1.5/24` connects to `192.168.1.10/24` (same subnet)
  - ❌ `192.168.1.5/24` does NOT connect to `192.168.2.5/24` (different subnets)

## 🔐 Security & Limitations

⚠️ **This is a demo/educational application**

### Security Notes
- User credentials are hardcoded for demonstration purposes
- No backend API or authentication server
- Data stored only in browser localStorage (not encrypted)
- Not suitable for production use without modifications
- No persistent database

### For Production Use:
- Implement proper backend authentication (OAuth 2.0, JWT)
- Add database persistence (PostgreSQL, MongoDB, etc.)
- Implement proper authorization checks on server
- Add comprehensive audit logging
- Use HTTPS/TLS encryption
- Implement rate limiting and DDoS protection
- Add input validation and sanitization

## 📋 Code Quality

- **TypeScript**: Full type safety, no `any` types allowed
- **ESLint**: Configured with strict rules (2-space indent, no semicolons, no extra empty lines)
- **Testing**: 90%+ coverage requirement for UI library components
- **Code Style**: Consistent formatting and naming conventions

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created as a modern network visualization tool for IT professionals and network engineers.

---

<div align="center">

**Made with ❤️ for Network Engineers**

⭐ **Star this repo** if you find it useful!

</div>
