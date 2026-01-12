# Employee Leave Management System

A complete, production-ready Employee Leave Management System built with Laravel 12, Inertia.js, React, and Tailwind CSS.

## Features

### 1. Team & Manager System
- Admin can create multiple teams
- Each team has exactly one manager
- Each employee belongs to one team
- Managers can approve/reject leave requests only for their team members
- Admin can manage all teams and users

### 2. Leave Balances & Holidays
- Global leave limits per leave type (e.g., 21 days annual leave)
- Custom leave limits per employee (overrides global)
- Dynamic leave balance calculation: `available = total - approved_used - pending`
- Admin can set global and custom leave limits

### 3. Leave Dashboard
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

### 4. Leave Types (Egyptian Default)
Pre-configured Egyptian leave types:
- Annual Leave (21 days)
- Casual Leave (7 days)
- Sick Leave (30 days, requires medical document)
- Official Holidays
- Emergency Leave (5 days)
- Maternity Leave (90 days, requires medical document)
- Paternity Leave (7 days)
- Unpaid Leave

Each leave type has:
- Paid/Unpaid status
- Max days per year
- Requires medical document flag
- Color coding

### 5. Leave Request Workflow
- Employee submits request → status = pending
- Manager approves or rejects
- If approved, leave balance is automatically deducted
- System prevents:
  - Requesting more days than available
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
- `resources/js/Pages/LeaveRequests/` - Leave request components (Index, Create, Show)
- `resources/js/Layouts/` - Layout components
- `resources/js/Components/` - Reusable components

## Key Routes

- `/dashboard` - Role-based dashboard
- `/leave-requests` - Leave requests index
- `/leave-requests/create` - Create new leave request
- `/leave-requests/{id}` - View leave request details
- `/teams` - Teams management (Admin only)
- `/leave-types` - Leave types management (Admin only)

## Security Features

- Role-based access control (Admin, Manager, Employee)
- Policy-based authorization
- Form request validation
- CSRF protection
- SQL injection prevention via Eloquent ORM
- XSS protection via React

## Next Steps

1. Configure your database connection
2. Run migrations and seeders
3. Build frontend assets
4. Start the development server
5. Login and explore the system!

## Notes

- The system uses Laravel's default authentication
- All dates are handled with Carbon
- Leave balances are calculated dynamically
- The system prevents overlapping approved leaves
- Managers can only approve requests for their team
