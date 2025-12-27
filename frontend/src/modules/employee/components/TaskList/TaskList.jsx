import { useState } from 'react';
import { useTasks, useUpdateTaskStatus } from '../../hooks';
import { TASK_STATUS, TASK_PRIORITY } from '../../constants';
import styles from './TaskList.module.css';

const TaskList = ({ limit, showFilters = true }) => {
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const { data: tasksData, isLoading } = useTasks({
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
    limit,
  });

  const updateStatus = useUpdateTaskStatus();

  const tasks = tasksData?.data || [];

  const handleStatusChange = (taskId, newStatus) => {
    updateStatus.mutate({ id: taskId, status: newStatus });
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return styles.priorityHigh;
      case 'medium':
        return styles.priorityMedium;
      case 'low':
        return styles.priorityLow;
      default:
        return '';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return styles.statusCompleted;
      case 'in_progress':
        return styles.statusInProgress;
      case 'pending':
        return styles.statusPending;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 'completed' || status === 'cancelled') return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className={styles.taskList}>
      {showFilters && (
        <div className={styles.filters}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Status</option>
            {Object.entries(TASK_STATUS).map(([key, value]) => (
              <option key={key} value={value.value}>
                {value.label}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Priority</option>
            {Object.entries(TASK_PRIORITY).map(([key, value]) => (
              <option key={key} value={value.value}>
                {value.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {isLoading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Loading tasks...</span>
        </div>
      ) : tasks.length === 0 ? (
        <div className={styles.empty}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>No tasks found</span>
        </div>
      ) : (
        <ul className={styles.list}>
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`${styles.taskItem} ${isOverdue(task.due_date, task.status) ? styles.overdue : ''}`}
            >
              <div className={styles.taskHeader}>
                <span className={`${styles.priority} ${getPriorityClass(task.priority)}`}>
                  {TASK_PRIORITY[task.priority?.toUpperCase()]?.label || task.priority}
                </span>
                <span className={`${styles.status} ${getStatusClass(task.status)}`}>
                  {TASK_STATUS[task.status?.toUpperCase()]?.label || task.status}
                </span>
              </div>

              <h4 className={styles.taskTitle}>{task.title}</h4>

              {task.description && (
                <p className={styles.taskDescription}>{task.description}</p>
              )}

              <div className={styles.taskFooter}>
                <div className={styles.taskMeta}>
                  {task.due_date && (
                    <span className={styles.dueDate}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(task.due_date)}
                    </span>
                  )}
                  {task.assigned_by_name && (
                    <span className={styles.assignedBy}>
                      From: {task.assigned_by_name}
                    </span>
                  )}
                </div>

                {task.status !== 'completed' && task.status !== 'cancelled' && (
                  <div className={styles.taskActions}>
                    {task.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(task.id, 'in_progress')}
                        className={styles.actionBtn}
                        disabled={updateStatus.isPending}
                      >
                        Start
                      </button>
                    )}
                    {task.status === 'in_progress' && (
                      <button
                        onClick={() => handleStatusChange(task.id, 'completed')}
                        className={`${styles.actionBtn} ${styles.completeBtn}`}
                        disabled={updateStatus.isPending}
                      >
                        Complete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
