# Super Admin Dashboard - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Backend server running on port 8080
- Database properly configured
- User with SUPER_ADMIN role

### Step 1: Start Backend
```bash
cd backend
mvn spring-boot:run
```

### Step 2: Start Frontend
```bash
cd frontend
npm run dev
```

### Step 3: Login as Super Admin
- Navigate to http://localhost:5173
- Login with SUPER_ADMIN credentials
- You'll be automatically redirected to the Super Admin Dashboard

---

## 📊 Dashboard Features

### Overview Tab
Shows all key metrics at a glance:
- System health status
- Today's business performance
- Inventory overview
- Top performing branches
- User statistics
- Recent activities

### System Health Tab
Detailed system monitoring:
- Real-time uptime percentage
- API response times
- Active user count
- Database connection pool status
- Memory and CPU usage
- Error rates

### Branches Tab
Branch performance analysis:
- Top 5 performing branches by sales
- Daily growth rates
- Order counts
- Staff information
- Inventory status per branch

### Analytics Tab
Comprehensive analytics:
- Sales trends
- User distribution
- Financial summaries
- Growth comparisons

---

## 🔄 Real-Time Updates

The dashboard automatically refreshes data:
- **System Metrics**: Every 30 seconds
- **Business Metrics**: Every 60 seconds
- **Recent Activities**: Every 30 seconds

You can also manually refresh any card using the refresh button (🔄).

---

## 🎯 Key Metrics Explained

### System Health Status
- **HEALTHY**: All systems operational (green)
- **WARNING**: Minor issues detected (yellow)
- **CRITICAL**: Immediate attention required (red)

### Growth Rate
- Positive %: Sales increasing (green arrow ↑)
- Negative %: Sales decreasing (red arrow ↓)
- Based on comparison with previous period

### Inventory Alerts
- **Low Stock**: Items below reorder level
- **Out of Stock**: Items with zero quantity
- **Expiring Soon**: Items expiring in 30 days
- **Critical Alerts**: Requires immediate action

---

## 🔍 Interactive Elements

### Clickable Cards
- **Branch cards**: Click to view branch details
- **User statistics**: Click to manage users
- **Branch performance**: Click "View All" for complete list

### Manual Refresh
- Look for the 🔄 icon on cards
- Click to fetch latest data immediately
- Icon spins while refreshing

---

## 📱 Responsive Design

The dashboard adapts to all screen sizes:
- **Desktop** (>1024px): Full 3-column layout
- **Tablet** (768-1024px): 2-column layout
- **Mobile** (<768px): Single column, stacked cards

---

## 🛠️ Troubleshooting

### Dashboard Not Loading
1. Check backend is running: `http://localhost:8080/api/dashboard/super-admin/health`
2. Verify you're logged in as SUPER_ADMIN
3. Check browser console for errors
4. Clear browser cache and reload

### Data Not Updating
1. Check network tab for failed API calls
2. Verify JWT token is valid
3. Check backend logs for errors
4. Try manual refresh using 🔄 button

### Permission Denied
- Ensure your user has SUPER_ADMIN role
- Re-login if token expired
- Contact administrator to verify role assignment

---

## 📊 API Endpoints Reference

### Complete Dashboard
```
GET /api/dashboard/super-admin
```

### Individual Metrics
```
GET /api/dashboard/super-admin/system-metrics
GET /api/dashboard/super-admin/branch-analytics
GET /api/dashboard/super-admin/business-metrics
GET /api/dashboard/super-admin/inventory-overview
GET /api/dashboard/super-admin/user-statistics
GET /api/dashboard/super-admin/financial-summary
GET /api/dashboard/super-admin/recent-activities?limit=10
```

### Health Check
```
GET /api/dashboard/super-admin/health
```

---

## 💡 Tips & Best Practices

1. **Monitor System Health**
   - Check daily for any warnings or critical alerts
   - Review error rates regularly
   - Ensure backup times are recent

2. **Branch Performance**
   - Compare growth rates across branches
   - Identify underperforming branches
   - Review staff allocation

3. **Inventory Management**
   - Act on critical alerts immediately
   - Monitor expiring items weekly
   - Review out-of-stock trends

4. **User Management**
   - Review recently added users
   - Monitor active vs. inactive users
   - Check online user count for capacity planning

5. **Financial Overview**
   - Track daily sales trends
   - Compare with previous periods
   - Monitor average order values

---

## 🎓 Training Resources

### For New Administrators
1. Familiarize yourself with the Overview tab first
2. Understand each metric's meaning
3. Practice using the tabs to switch views
4. Learn to interpret growth rates and trends

### For System Monitoring
1. Check System Health tab at start of day
2. Review Recent Activities periodically
3. Monitor critical alerts
4. Set up routine checks for key metrics

---

## 📞 Support & Feedback

### Need Help?
- Check the comprehensive documentation: `SUPER_ADMIN_REALTIME_API_IMPLEMENTATION.md`
- Review backend logs: `backend/logs/application.log`
- Check browser console for frontend errors

### Report Issues
- Document the issue with screenshots
- Include browser and OS information
- Note any error messages
- Describe steps to reproduce

---

## ✅ Quick Health Check

Run this checklist daily:
- [ ] System status is HEALTHY
- [ ] No critical inventory alerts
- [ ] Error rate below 0.5%
- [ ] Database backup is recent
- [ ] All branches showing activity
- [ ] No users requiring attention

---

**Version**: 1.0.0  
**Last Updated**: January 26, 2026  
**Status**: Production Ready ✅
