import { useState, useMemo } from 'react';
import { useSchedule, useCreateSchedule, useDeleteSchedule, useScheduleConflicts, useScheduleTemplates, useApplyTemplate } from '../../hooks';
import { SHIFT_TYPES, SCHEDULE_STATUS } from '../../constants';
import styles from './ScheduleManager.module.css';

const ScheduleManager = () => {
  const [currentWeek, setCurrentWeek] = useState(getWeekDates(new Date()));
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    staff_id: '',
    date: '',
    shift_type: 'morning',
    start_time: '',
    end_time: '',
    notes: '',
  });

  const { data: scheduleData, isLoading } = useSchedule({
    start_date: currentWeek[0].toISOString().split('T')[0],
    end_date: currentWeek[6].toISOString().split('T')[0],
  });
  const { data: conflictsData } = useScheduleConflicts();
  const { data: templatesData } = useScheduleTemplates();

  const createSchedule = useCreateSchedule();
  const deleteSchedule = useDeleteSchedule();
  const applyTemplate = useApplyTemplate();

  const schedules = scheduleData?.data || [];
  const conflicts = conflictsData?.data || [];
  const templates = templatesData?.data || [];

  // Staff list from schedule data
  const staffList = useMemo(() => {
    const staffMap = new Map();
    schedules.forEach((s) => {
      if (!staffMap.has(s.staff_id)) {
        staffMap.set(s.staff_id, {
          id: s.staff_id,
          name: s.staff_name,
          role: s.staff_role,
        });
      }
    });
    return Array.from(staffMap.values());
  }, [schedules]);

  function getWeekDates(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    const monday = new Date(date.setDate(diff));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeek[0]);
    newDate.setDate(newDate.getDate() + direction * 7);
    setCurrentWeek(getWeekDates(newDate));
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
  };

  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getScheduleForCell = (staffId, date) => {
    const dateKey = formatDateKey(date);
    return schedules.find(
      (s) => s.staff_id === staffId && s.date === dateKey
    );
  };

  const getShiftColor = (shiftType) => {
    switch (shiftType) {
      case 'morning':
        return styles.shiftMorning;
      case 'afternoon':
        return styles.shiftAfternoon;
      case 'evening':
        return styles.shiftEvening;
      case 'night':
        return styles.shiftNight;
      default:
        return '';
    }
  };

  const handleCellClick = (staffId, date) => {
    const existing = getScheduleForCell(staffId, date);
    if (existing) {
      // Show existing schedule
      setSelectedCell(existing);
    } else {
      // Create new schedule
      const staffMember = staffList.find((s) => s.id === staffId);
      setScheduleForm({
        staff_id: staffId,
        staff_name: staffMember?.name || '',
        date: formatDateKey(date),
        shift_type: 'morning',
        start_time: SHIFT_TYPES.MORNING.start,
        end_time: SHIFT_TYPES.MORNING.end,
        notes: '',
      });
      setShowAddModal(true);
    }
  };

  const handleShiftTypeChange = (shiftType) => {
    const shift = SHIFT_TYPES[shiftType.toUpperCase()];
    if (shift) {
      setScheduleForm((prev) => ({
        ...prev,
        shift_type: shiftType,
        start_time: shift.start,
        end_time: shift.end,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createSchedule.mutate(scheduleForm, {
      onSuccess: () => {
        setShowAddModal(false);
        setScheduleForm({
          staff_id: '',
          date: '',
          shift_type: 'morning',
          start_time: '',
          end_time: '',
          notes: '',
        });
      },
    });
  };

  const handleDeleteSchedule = (id) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      deleteSchedule.mutate(id);
      setSelectedCell(null);
    }
  };

  const handleApplyTemplate = (templateId) => {
    applyTemplate.mutate({
      template_id: templateId,
      start_date: formatDateKey(currentWeek[0]),
    }, {
      onSuccess: () => setShowTemplateModal(false),
    });
  };

  return (
    <div className={styles.scheduleManager}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.weekNav}>
          <button onClick={() => navigateWeek(-1)} className={styles.navBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className={styles.weekTitle}>
            {currentWeek[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
            {currentWeek[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <button onClick={() => navigateWeek(1)} className={styles.navBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className={styles.actions}>
          <button onClick={() => setCurrentWeek(getWeekDates(new Date()))} className={styles.todayBtn}>
            Today
          </button>
          <button onClick={() => setShowTemplateModal(true)} className={styles.templateBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Templates
          </button>
        </div>
      </div>

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <div className={styles.conflictAlert}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{conflicts.length} scheduling conflict(s) detected</span>
          <button className={styles.viewConflicts}>View</button>
        </div>
      )}

      {/* Legend */}
      <div className={styles.legend}>
        {Object.entries(SHIFT_TYPES).map(([key, value]) => (
          <div key={key} className={styles.legendItem}>
            <span className={`${styles.legendColor} ${getShiftColor(key.toLowerCase())}`} />
            <span>{value.label}</span>
          </div>
        ))}
      </div>

      {/* Schedule Grid */}
      <div className={styles.gridContainer}>
        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <span>Loading schedule...</span>
          </div>
        ) : (
          <table className={styles.scheduleGrid}>
            <thead>
              <tr>
                <th className={styles.staffColumn}>Staff</th>
                {currentWeek.map((date, index) => (
                  <th key={index} className={date.toDateString() === new Date().toDateString() ? styles.today : ''}>
                    {formatDate(date)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staffList.length === 0 ? (
                <tr>
                  <td colSpan={8} className={styles.empty}>
                    No staff schedules found
                  </td>
                </tr>
              ) : (
                staffList.map((staff) => (
                  <tr key={staff.id}>
                    <td className={styles.staffCell}>
                      <div className={styles.staffInfo}>
                        <div className={styles.staffAvatar}>
                          {staff.name?.charAt(0)?.toUpperCase() || 'S'}
                        </div>
                        <div>
                          <span className={styles.staffName}>{staff.name}</span>
                          <span className={styles.staffRole}>{staff.role}</span>
                        </div>
                      </div>
                    </td>
                    {currentWeek.map((date, index) => {
                      const schedule = getScheduleForCell(staff.id, date);
                      const isToday = date.toDateString() === new Date().toDateString();
                      return (
                        <td
                          key={index}
                          className={`${styles.scheduleCell} ${isToday ? styles.today : ''}`}
                          onClick={() => handleCellClick(staff.id, date)}
                        >
                          {schedule ? (
                            <div className={`${styles.scheduleBlock} ${getShiftColor(schedule.shift_type)}`}>
                              <span className={styles.shiftLabel}>
                                {SHIFT_TYPES[schedule.shift_type?.toUpperCase()]?.label || schedule.shift_type}
                              </span>
                              <span className={styles.shiftTime}>
                                {schedule.start_time?.slice(0, 5)} - {schedule.end_time?.slice(0, 5)}
                              </span>
                            </div>
                          ) : (
                            <span className={styles.addHint}>+</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Schedule Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Add Schedule</h3>
            <div className={styles.scheduleInfo}>
              <span>{scheduleForm.staff_name}</span>
              <span>{new Date(scheduleForm.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.shiftTypes}>
                {Object.entries(SHIFT_TYPES).map(([key, value]) => (
                  <button
                    key={key}
                    type="button"
                    className={`${styles.shiftTypeBtn} ${scheduleForm.shift_type === key.toLowerCase() ? styles.active : ''} ${getShiftColor(key.toLowerCase())}`}
                    onClick={() => handleShiftTypeChange(key.toLowerCase())}
                  >
                    {value.label}
                  </button>
                ))}
              </div>

              <div className={styles.timeInputs}>
                <div className={styles.formGroup}>
                  <label>Start Time</label>
                  <input
                    type="time"
                    value={scheduleForm.start_time}
                    onChange={(e) => setScheduleForm((prev) => ({ ...prev, start_time: e.target.value }))}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>End Time</label>
                  <input
                    type="time"
                    value={scheduleForm.end_time}
                    onChange={(e) => setScheduleForm((prev) => ({ ...prev, end_time: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Notes (Optional)</label>
                <textarea
                  value={scheduleForm.notes}
                  onChange={(e) => setScheduleForm((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  placeholder="Any special instructions..."
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowAddModal(false)} className={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn} disabled={createSchedule.isPending}>
                  {createSchedule.isPending ? 'Saving...' : 'Save Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Schedule Modal */}
      {selectedCell && (
        <div className={styles.modalOverlay} onClick={() => setSelectedCell(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Schedule Details</h3>
            <div className={styles.detailContent}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Staff</span>
                <span className={styles.detailValue}>{selectedCell.staff_name}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Date</span>
                <span className={styles.detailValue}>
                  {new Date(selectedCell.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Shift</span>
                <span className={`${styles.shiftBadge} ${getShiftColor(selectedCell.shift_type)}`}>
                  {SHIFT_TYPES[selectedCell.shift_type?.toUpperCase()]?.label || selectedCell.shift_type}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Time</span>
                <span className={styles.detailValue}>
                  {selectedCell.start_time?.slice(0, 5)} - {selectedCell.end_time?.slice(0, 5)}
                </span>
              </div>
              {selectedCell.notes && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Notes</span>
                  <span className={styles.detailValue}>{selectedCell.notes}</span>
                </div>
              )}
            </div>
            <div className={styles.modalActions}>
              <button onClick={() => handleDeleteSchedule(selectedCell.id)} className={styles.deleteBtn}>
                Delete
              </button>
              <button onClick={() => setSelectedCell(null)} className={styles.cancelBtn}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Modal */}
      {showTemplateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowTemplateModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Schedule Templates</h3>
            <div className={styles.templateList}>
              {templates.length === 0 ? (
                <div className={styles.empty}>No templates available</div>
              ) : (
                templates.map((template) => (
                  <div key={template.id} className={styles.templateItem}>
                    <div className={styles.templateInfo}>
                      <span className={styles.templateName}>{template.name}</span>
                      <span className={styles.templateDesc}>{template.description}</span>
                    </div>
                    <button
                      onClick={() => handleApplyTemplate(template.id)}
                      className={styles.applyBtn}
                      disabled={applyTemplate.isPending}
                    >
                      Apply
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className={styles.modalActions}>
              <button onClick={() => setShowTemplateModal(false)} className={styles.cancelBtn}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManager;
