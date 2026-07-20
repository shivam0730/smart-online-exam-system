import styles from "./BrowserWindow.module.css";
import {
  sidebarItems,
  dashboardStats,
  recentExams,
} from "../../../utils/dashboardData";

const BrowserWindow = () => {
  return (
    <div className={styles.browser}>
      {/* Browser Header */}
      <div className={styles.header}>
        <div className={styles.dots}>
          <span />
          <span />
          <span />
        </div>

        <div className={styles.addressBar}>
          smart-exam.ai/dashboard
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <h3>SOES</h3>

          {sidebarItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className={`${styles.menuItem} ${item.active ? styles.active : ""
                  }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </aside>

        {/* Main */}
        <main className={styles.main}>
          <h2>Dashboard Overview</h2>

          <div className={styles.stats}>
            {dashboardStats.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className={styles.card}
                >
                  <Icon
                    size={22}
                    color={card.color}
                  />

                  <h3>{card.value}</h3>

                  <p>{card.title}</p>
                </div>
              );
            })}
          </div>

          <div className={styles.table}>
            <h3>Recent Exams</h3>

            {recentExams.map((exam) => (
              <div
                key={exam.title}
                className={styles.row}
              >
                <span>{exam.title}</span>

                <span>{exam.students}</span>

                <span className={styles.status}>
                  {exam.status}
                </span>
              </div>
            ))}
          </div>
        </main>

      </div>
    </div>
  );
};

export default BrowserWindow;