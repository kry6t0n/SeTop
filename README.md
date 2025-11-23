# 🌐 Network Topology Visualizer

<div align="center">

A modern, interactive web application for creating, editing, and managing network topologies with real-time validation, device management, and comprehensive connection logic.

[![React](https://img.shields.io/badge/React-18.2+-blue?logo=react)](https://react.dev)
[![React Router](https://img.shields.io/badge/React%20Router-v6-orange?logo=react-router)](https://reactrouter.com)
[![ReactFlow](https://img.shields.io/badge/ReactFlow-v11.7-brightgreen?logo=react)](https://reactflow.dev)
[![Vite](https://img.shields.io/badge/Vite-v4.5-purple?logo=vite)](https://vitejs.dev)


[Features](#-key-features) • [Quick Start](#-getting-started) • [Documentation](#-documentation) • [Architecture](#-architecture)

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

**Connection Properties**:
- Connection type selector
- Status management (Active/Inactive/Error)
- Bandwidth information
- Custom descriptions
- One-click delete

### 🖧 Device Management

**Supported Device Types**:
- **Router** 🖥️ - Network routing and gateway
- **Switch** 🔀 - LAN switching and port management
- **Server** 📦 - Data storage and services
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

**Compatibility Matrix**:
| From | To | Physical | Routing | Logical |
|------|-----|----------|---------|---------|
| Router | Switch | ✅ | ❌ | ✅ |
| Router | Router | ❌ | ✅ | ✅ |
| Switch | Server | ✅ | ❌ | ✅ |
| Switch | Workstation | ✅ | ❌ | ✅ |
| Any | Network | ✅ | ✅ | ✅ |

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
- **Vite v4.5** - Lightning-fast build tool
- **TypeScript** - Type checking support
- **CSS3** - Modern styling

### UI Library (`/ui-library`)
Reusable component library:
- **Button** - Customizable button component with variants
- **Modal** - Flexible modal dialog with animations
- **FileUpload** - File upload component with validation

## 📦 Getting Started

### Prerequisites
- **Node.js** 16+ (18+ recommended)
- **npm** 8+ or **yarn** 1.22+
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/Network-Topology-Visualizer.git
cd Network-Topology-Visualizer

# 2. Install frontend dependencies
cd frontend
npm install

# 3. Start development server
npm run dev
```

The application will be available at `http://localhost:3000` (or next available port if 3000 is busy).

### 🔓 Demo Credentials

Use these credentials to log in and explore all features:

| Username | Password | Role | Access |
|----------|----------|------|--------|
| admin | admin123 | Administrator | Full access, admin panel |
| engineer | engineer123 | Network Engineer | Create and edit topologies |
| user | user123 | Regular User | View-only access |

## 📚 Documentation

- **[Setup Guide](./SETUP.md)** - Detailed installation, configuration, and troubleshooting
- **[Network Logic](./NETWORK_LOGIC.md)** - Connection types, validation rules, IP compatibility matrix
- **[Checklist](./CHECKLIST.md)** - Feature implementation status and project structure

## 🛠️ Available Commands

### Development
```bash
npm run dev              # Start development server with HMR
```

### Production
```bash
npm run build            # Build for production with optimizations
npm run preview          # Preview production build locally
```

### Code Quality
```bash
npm run type-check       # Run TypeScript type checking
npm run lint             # Lint code (if configured)
```

## 📁 Project Structure

```
Network-Topology-Visualizer/
├── 📦 frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Canvas/
│   │   │   │   ├── NetworkCanvas.tsx         # Main canvas with ReactFlow
│   │   │   │   ├── Toolbar.tsx               # Property editor sidebar
│   │   │   │   └── CustomNodes/
│   │   │   │       └── CustomNode.tsx        # Device node rendering
│   │   │   └── Layout/
│   │   │       └── Header.tsx                # Navigation header
│   │   ├── pages/
│   │   │   ├── Login.tsx                     # Authentication page
│   │   │   ├── Dashboard.tsx                 # Landing page
│   │   │   ├── Editor.tsx                    # Main editor page
│   │   │   ├── Account.tsx                   # User profile & projects
│   │   │   └── Admin.tsx                     # Admin panel
│   │   ├── utils/
│   │   │   ├── connectionLogic.ts            # Connection types & validation
│   │   │   ├── projectService.ts             # localStorage operations
│   │   │   ├── exportUtils.ts                # Import/Export JSON
│   │   │   └── validation.ts                 # Form validation helpers
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx               # Authentication state
│   │   ├── hooks/
│   │   │   └── useLocalStorage.ts            # localStorage React hook
│   │   ├── styles/
│   │   │   └── *.css                         # Component styles
│   │   ├── App.tsx                           # Root component
│   │   └── main.tsx                          # Entry point
│   ├── index.html                            # HTML template
│   ├── package.json                          # Dependencies
│   ├── vite.config.js                        # Build configuration
│   ├── tsconfig.json                         # TypeScript config
│   └── README.md                             # Frontend documentation
│
├── 📚 ui-library/
│   ├── src/
│   │   ├── Button/                           # Button component
│   │   │   ├── Button.tsx
│   │   │   └── Button.module.css
│   │   ├── Modal/                            # Modal component
│   │   │   ├── Modal.tsx
│   │   │   └── Modal.css
│   │   ├── FileUpload/                       # File upload component
│   │   │   ├── FileUpload.tsx
│   │   │   └── FileUpload.css
│   │   └── index.ts                          # Component exports
│   ├── package.json                          # Library config
│   ├── vite.config.ts                        # Build configuration
│   ├── tsconfig.json                         # TypeScript config
│   └── README.md                             # Library documentation
│
├── .gitignore                                # Git ignore rules
├── SETUP.md                                  # Setup instructions
├── NETWORK_LOGIC.md                          # Network validation rules
├── CHECKLIST.md                              # Implementation checklist
└── README.md                                 # This file
```

## 🔄 Workflow Example

1. **Login** with demo credentials
2. **Navigate to Editor** to create a new network topology
3. **Add Devices** by clicking "Add Node" and selecting device type
4. **Configure Devices** with IP addresses and subnet masks in the right sidebar
5. **Create Connections** by dragging from one device to another
6. **Adjust Connection Properties**:
   - Change connection type (Physical/Routing/Logical)
   - Set status (Active/Inactive/Error)
   - Add bandwidth information
   - Add custom description
7. **Validate and Save** - System checks compatibility and saves to localStorage
8. **Export Project** - Download as JSON for backup or sharing
9. **View Projects** - Go to Account page to manage all saved topologies

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
  - ✅ `10.0.0.5/16` connects to `10.0.5.10/16` (same /16 subnet)

### Automatic Type Suggestion

When you try to connect two devices, the system suggests the appropriate connection type:
- Same subnet → Physical
- Different subnets with Router → Routing
- Virtual connections → Logical

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
- Implement CORS properly

## 🚀 Future Enhancements

Potential features for future versions:
- [ ] Backend API with database persistence
- [ ] Real-time collaboration (WebSocket support)
- [ ] Device grouping and virtual networks
- [ ] Network statistics and analytics dashboard
- [ ] Connection bandwidth visualization
- [ ] Network simulation and traffic modeling
- [ ] Export to diagram formats (PNG, SVG, PDF)
- [ ] Dark mode support
- [ ] Mobile app version
- [ ] Network device templates library
- [ ] Drag-to-select multiple nodes
- [ ] Undo/Redo functionality

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards
- Follow existing code style and conventions
- Add comments for complex logic
- Test features before submitting PR
- Update documentation if needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Created as a modern network visualization tool for IT professionals and network engineers.

## 🤔 FAQ

**Q: Can I save projects to a database?**
A: Currently, projects are saved to browser localStorage only. To use a database, implement a backend API with Express.js, Node.js, or similar.

**Q: Can multiple users collaborate in real-time?**
A: Not yet. This feature would require WebSocket support, real-time synchronization, and a backend server.

**Q: Is this suitable for managing production networks?**
A: No, this is an educational tool. For real network management, use enterprise solutions like Cisco Prime Infrastructure, Juniper Contrail, or open-source alternatives like GNS3.

**Q: How are device IPs validated?**
A: The system calculates network addresses using CIDR notation and checks subnet compatibility. Invalid IP formats or duplicate addresses are rejected.

**Q: Can I export the network diagram as an image?**
A: Currently, you can export as JSON. Image export would require additional libraries like html2canvas or similar.

**Q: What browsers are supported?**
A: All modern browsers: Chrome/Chromium 90+, Firefox 88+, Safari 14+, Edge 90+

## 📞 Support & Feedback

For issues, questions, or feature requests:
- 🐛 Open an [Issue](https://github.com/yourusername/Network-Topology-Visualizer/issues)
- 💬 Check [Network Logic](./NETWORK_LOGIC.md) for technical details
- 📖 Review [Setup Guide](./SETUP.md) for installation help

---

<div align="center">

**Made with ❤️ for Network Engineers**

⭐ **Star this repo** if you find it useful!

[Report Bug](https://github.com/yourusername/Network-Topology-Visualizer/issues) • [Request Feature](https://github.com/yourusername/Network-Topology-Visualizer/issues)

</div>
> **Лабораторная работа 6**
> 
> - [Архитектурные требования](./architecture.md)
> - [Функциональные требования MVP](./mvp.md)
> - [Исходный Pull Request](https://github.com/kry6t0n/SeTop/pull/1)