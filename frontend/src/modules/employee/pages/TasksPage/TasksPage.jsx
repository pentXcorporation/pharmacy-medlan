import { TaskList } from '../../components';
import styles from './TasksPage.module.css';

const TasksPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>My Tasks</h1>
          <p className={styles.subtitle}>View and manage your assigned tasks</p>
        </div>
      </div>
      
      <div className={styles.content}>
        <TaskList showFilters />
      </div>
    </div>
  );
};

export default TasksPage;
