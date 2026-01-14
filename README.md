# Employee Leave Management System

A complete, production-ready Employee Leave Management System built with Laravel 12, Inertia.js, React, and Tailwind CSS.

## Features

### Team & Manager System
- Admin can create multiple teams
- Each team has exactly one manager
- Each employee belongs to one team
- Managers can approve/reject leave requests only for their team members
- Admin can manage all teams and users

### Leave Balances
- Global leave limits per leave type (e.g., 21 days annual leave)
- Custom leave limits per employee (overrides global)
- Dynamic leave balance calculation: `available = total - approved_used - pending`
- Admin and Managers can set global and custom leave limits
- Leave balances are only created for leave types where `has_balance = true`
- **Users Page**: Displays used/available leave days for each user and each leave type with expandable rows
- Leave balance information is automatically hidden for leave types without balance tracking

### Leave Dashboard
**Managers see:**
- All leave requests for their team
- Filter by status, date, and leave type
- Real-time overview of who is on leave today
- Who will be on leave next week

**Employees see:**
- Their own leave history
- Remaining leave balance for each leave type
- Request new leave

**Admins see:**
- System-wide statistics
- All teams and employees
- All leave requests
- Leave balance management for all users
- Ability to issue leaves for any user

### Leave Types Management (Admin Only)
Pre-configured Egyptian leave types:
- Annual Leave (21 days)
- Casual Leave (7 days)
- Sick Leave (30 days, requires medical document)
- Official Holidays
- Emergency Leave (5 days)
- Maternity Leave (90 days, requires medical document)
- Paternity Leave (7 days)
- Unpaid Leave (no balance tracking)
- Special Leave (admin/manager only, no balance tracking)

**Flexible Leave Type Configuration:**
- **Has Balance**: Toggle whether a leave type tracks balance (e.g., Unpaid Leave and Special Leave don't track balance)
- **Visible to Employees**: Control which leave types employees can see and request
- **Max Days Per Year**: Only shown for leave types that have balance tracking
- Admin can create, edit, and delete leave types with full CRUD operations

### Leave Request Workflow
- Employee submits request → status = pending
- Manager approves or rejects
- If approved, leave balance is automatically deducted (only for leave types with balance tracking)
- **Admin/Manager Leave Issuance**: Admins and Managers can create leave requests on behalf of other users
  - Select target user from dropdown
  - View their specific leave balances
  - System automatically loads the selected user's leave balances
- System prevents:
  - Requesting more days than available (for leave types with balance)
  - Overlapping approved leaves

## Tech Stack

- **Backend:** Laravel 12
- **Frontend:** React with Inertia.js
- **Styling:** Tailwind CSS
- **Database:** MySQL
- **Authentication:** Laravel Breeze

## Installation

1. Install dependencies:
```bash
composer install
npm install
```

2. Set up environment:
```bash
cp .env.example .env
php artisan key:generate
```

3. Configure database in `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=leaves
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

4. Run migrations and seeders:
```bash
php artisan migrate
php artisan db:seed
```

5. Build frontend assets:
```bash
npm run build
# or for development
npm run dev
```

## Default Users

After seeding, you can login with:

- **Admin:** admin@example.com / password
- **Manager 1:** manager1@example.com / password
- **Manager 2:** manager2@example.com / password
- **Employee 1:** employee1@example.com / password
- **Employee 2:** employee2@example.com / password
- **Employee 3:** employee3@example.com / password
- **Employee 4:** employee4@example.com / password
- **Employee 5:** employee5@example.com / password

## Project Structure

### Backend
- `app/Models/` - Eloquent models (User, Team, LeaveType, LeaveRequest, LeaveBalance)
- `app/Http/Controllers/` - Controllers (Dashboard, LeaveRequest, Team, LeaveType, LeaveBalance)
- `app/Http/Requests/` - Form request validators
- `app/Policies/` - Authorization policies
- `database/migrations/` - Database migrations
- `database/seeders/` - Database seeders

### Frontend
- `resources/js/Pages/Dashboard/` - Dashboard components (Admin, Manager, Employee)
- `resources/js/Pages/LeaveRequests/` - Leave request components (Index, Create, Edit, Show)
- `resources/js/Pages/LeaveTypes/` - Leave type management components (Index, Create, Edit)
- `resources/js/Pages/Users/` - User management with leave balance display
- `resources/js/Layouts/` - Layout components
- `resources/js/Components/` - Reusable components

## Recent Features

### Enhanced Leave Type Management
- **Has Balance Flag**: Leave types can now be configured to track or not track balance
- **Visible to Employees Flag**: Control which leave types are visible to employees
- **Special Leave Types**: Support for leave types that don't deduct from balance (e.g., Special Leave, Unpaid Leave)
- Leave balance information automatically hidden for leave types without balance tracking

### User Management Enhancements
- **Leave Balance Display**: Users page now shows used/available leave days for each user and each leave type
- **Expandable Rows**: Click to expand and view detailed leave balance breakdown
- **Excel Export**: Leave balance data included in user export
- **Filter Design**: Consistent filter design matching leave requests page (container with filter button)

### Admin/Manager Features
- **Leave Issuance**: Admins and Managers can create leave requests for other users
- **User Selection**: Dropdown to select target user when creating leave requests
- **Dynamic Balance Loading**: Automatically loads selected user's leave balances
- **Leave Balance Management**: Admins and Managers can manage leave balances for all users

### UI Improvements
- **Centered Navigation**: Navigation links are centered with application name on left
- **Application Name**: Replaced logo with application name in header
- **Consistent Filtering**: Unified filter design across pages with SectionContainer
