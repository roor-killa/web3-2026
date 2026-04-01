'use client';

import { useState, useCallback, useEffect } from 'react';
import styles from './scraper.module.css';

const FASTAPI_BASE = 'http://localhost:8002';
const API_BASE = 'http://localhost:8000/api';

interface Tab {
  id: string;
  label: string;
}

interface TaskStatus {
  task_id: string;
  status: string;
  territory: string;
  pages_scraped: number;
  total_products: number;
  started_at: string;
  completed_at?: string;
  error?: string;
}

interface Config {
  [key: string]: {
    value: any;
    type: string;
    description?: string;
  };
}

interface Schedule {
  id: number;
  cron_expression: string;
  name?: string;
  territories: string[];
  max_pages: number;
  enabled: boolean;
  last_executed_at?: string;
  next_execution_at?: string;
}

interface ExecutionLog {
  id: number;
  task_id: string;
  status: string;
  territory: string;
  pages_scraped: number;
  total_products: number;
  error_message?: string;
  started_at: string;
  completed_at?: string;
  duration_seconds?: number;
  created_at: string;
}

export default function ScraperAdminDashboard() {
  // États
  const [activeTab, setActiveTab] = useState('overview');
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Onglets du dashboard
  const tabs: Tab[] = [
    { id: 'overview', label: '📊 Aperçu' },
    { id: 'launch', label: '🚀 Lancer Scraping' },
    { id: 'config', label: '⚙️ Configuration' },
    { id: 'schedules', label: '⏰ Horaires' },
    { id: 'history', label: '📝 Historique' },
    { id: 'logs', label: '📋 Logs' },
    { id: 'fastapi', label: '🔗 FastAPI' },
  ];

  // Récupérateur du token
  const getToken = useCallback(async () => {
    if (token) return token;

    const stored = localStorage.getItem('sanctum_token');
    if (stored) {
      setToken(stored);
      return stored;
    }
    return null;
  }, [token]);

  // Récupérateur du header d'authentification
  const getAuthHeaders = useCallback((currentToken?: string | null) => {
    const t = currentToken || token;
    return {
      'Content-Type': 'application/json',
      'Authorization': t ? `Bearer ${t}` : '',
    };
  }, [token]);

  // Initialisation du token
  useEffect(() => {
    getToken();
  }, [getToken]);

  // Notification
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  // ==================== TAB: OVERVIEW ====================
  function OverviewTab() {
    const [health, setHealth] = useState<any>(null);
    const [tasks, setTasks] = useState<TaskStatus[]>([]);

    useEffect(() => {
      const loadData = async () => {
        try {
          const currentToken = await getToken();

          // Charger la santé du système
          const healthRes = await fetch(
            `${API_BASE}/scraper/health`,
            { headers: getAuthHeaders(currentToken) }
          );
          const healthData = await healthRes.json();
          setHealth(healthData);

          // Charger les tâches depuis FastAPI
          const tasksRes = await fetch(
            `${FASTAPI_BASE}/tasks`,
            { headers: { 'Content-Type': 'application/json' } }
          );
          const tasksData = await tasksRes.json();
          if (tasksData.tasks) {
            const taskList = Object.values(tasksData.tasks) as TaskStatus[];
            setTasks(taskList.slice(0, 10));
          }
        } catch (error) {
          console.error('Erreur chargement overview:', error);
        }
      };

      loadData();
      const interval = setInterval(loadData, 5000); // Rafraîchir chaque 5 secondes
      return () => clearInterval(interval);
    }, [getToken, getAuthHeaders]);

    return (
      <div className={styles.tabContent}>
        <h2>Aperçu du Système</h2>

        {health && (
          <div className={styles.healthCard}>
            <h3>Santé du Système</h3>
            <p>
              <strong>État:</strong>{' '}
              <span
                className={
                  health.health === 'healthy' ? styles.statusHealthy : styles.statusDegraded
                }
              >
                {health.health === 'healthy' ? '✅ Sain' : '⚠️ Dégradé'}
              </span>
            </p>
            {health.stats && (
              <>
                <p><strong>Taux de succès:</strong> {health.stats.success_rate}%</p>
                <p><strong>Exécutions récentes:</strong> {health.stats.recent_executions}</p>
                <p><strong>Réussies:</strong> {health.stats.completed}</p>
                <p><strong>Échouées:</strong> {health.stats.failed}</p>
              </>
            )}
          </div>
        )}

        <div className={styles.tasksSection}>
          <h3>Tâches Récentes</h3>
          {tasks.length === 0 ? (
            <p>Aucune tâche</p>
          ) : (
            <table className={styles.logsTable}>
              <thead>
                <tr>
                  <th>Task ID</th>
                  <th>Statut</th>
                  <th>Territoire</th>
                  <th>Produits</th>
                  <th>Lancée</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.task_id}>
                    <td className={styles.code}>{task.task_id.slice(0, 20)}...</td>
                    <td>
                      <span
                        className={`${styles.badge} ${
                          task.status === 'completed'
                            ? styles.success
                            : task.status === 'failed'
                            ? styles.error
                            : styles.info
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td>{task.territory}</td>
                    <td>{task.total_products}</td>
                    <td>{new Date(task.started_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  // ==================== TAB: LAUNCH ====================
  function LaunchTab() {
    const [territory, setTerritory] = useState('gp');
    const [maxPages, setMaxPages] = useState(10);
    const [delay, setDelay] = useState(1.5);
    const [launchedTaskId, setLaunchedTaskId] = useState<string | null>(null);

    const handleLaunch = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        const response = await fetch(`${FASTAPI_BASE}/scrape`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            territory,
            max_pages: parseInt(maxPages.toString()),
            min_delay: parseFloat(delay.toString()),
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setLaunchedTaskId(data.task_id);
          showMessage('success', `🚀 Scraping lancé! Task ID: ${data.task_id}`);
        } else {
          showMessage('error', `Erreur: ${data.detail || 'Impossible de lancer le scraping'}`);
        }
      } catch (error) {
        showMessage('error', `Erreur réseau: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className={styles.tabContent}>
        <h2>Lancer un Scraping Manuel</h2>

        <form onSubmit={handleLaunch} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="territory">Territoire</label>
            <select
              id="territory"
              value={territory}
              onChange={(e) => setTerritory(e.target.value)}
              required
            >
              <option value="gp">Guadeloupe</option>
              <option value="mq">Martinique</option>
              <option value="re">La Réunion</option>
              <option value="gf">Guyane</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="maxPages">Nombre de Pages</label>
            <input
              id="maxPages"
              type="number"
              min="1"
              max="100"
              value={maxPages}
              onChange={(e) => setMaxPages(parseInt(e.target.value))}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="delay">Délai min (secondes)</label>
            <input
              id="delay"
              type="number"
              min="0.5"
              step="0.1"
              value={delay}
              onChange={(e) => setDelay(parseFloat(e.target.value))}
              required
            />
          </div>

          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? '⏳ En cours...' : '🚀 Lancer le Scraping'}
          </button>
        </form>

        {launchedTaskId && (
          <TaskMonitor taskId={launchedTaskId} />
        )}
      </div>
    );
  }

  // Composant de suivi des tâches
  function TaskMonitor({ taskId }: { taskId: string }) {
    const [status, setStatus] = useState<TaskStatus | null>(null);

    useEffect(() => {
      const checkStatus = async () => {
        try {
          const response = await fetch(
            `${FASTAPI_BASE}/task/${taskId}`,
            { headers: { 'Content-Type': 'application/json' } }
          );
          const data = await response.json();
          setStatus(data);
        } catch (error) {
          console.error('Erreur lecture statut:', error);
        }
      };

      checkStatus();
      const interval = setInterval(checkStatus, 2000);
      return () => clearInterval(interval);
    }, [taskId]);

    if (!status) return <p>Chargement...</p>;

    return (
      <div className={styles.taskMonitor}>
        <h3>Suivi de la Tâche</h3>
        <p>
          <strong>Task ID:</strong> {taskId}
        </p>
        <p>
          <strong>Statut:</strong>{' '}
          <span className={styles[`status${status.status.charAt(0).toUpperCase() + status.status.slice(1).toLowerCase()}`]}>
            {status.status}
          </span>
        </p>
        <p><strong>Produits trouvés:</strong> {status.total_products}</p>
        <p><strong>Pages scrapées:</strong> {status.pages_scraped}</p>
        <p><strong>Lancée:</strong> {new Date(status.started_at).toLocaleString()}</p>
        {status.completed_at && (
          <p><strong>Terminée:</strong> {new Date(status.completed_at).toLocaleString()}</p>
        )}
        {status.error && <p className={styles.error}><strong>Erreur:</strong> {status.error}</p>}
      </div>
    );
  }

  // ==================== TAB: CONFIG ====================
  function ConfigTab() {
    const [configs, setConfigs] = useState<Config>({});
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState('');

    useEffect(() => {
      loadConfigs();
    }, [getToken, getAuthHeaders]);

    const loadConfigs = async () => {
      try {
        const currentToken = await getToken();
        const response = await fetch(
          `${API_BASE}/scraper/config`,
          { headers: getAuthHeaders(currentToken) }
        );
        const data = await response.json();
        if (data.success) {
          setConfigs(data.data);
        }
      } catch (error) {
        console.error('Erreur chargement config:', error);
      }
    };

    const handleSaveConfig = async (key: string, value: string, type: string = 'string') => {
      try {
        const currentToken = await getToken();
        const response = await fetch(
          `${API_BASE}/scraper/config`,
          {
            method: 'POST',
            headers: getAuthHeaders(currentToken),
            body: JSON.stringify({ key, value, type }),
          }
        );

        if (response.ok) {
          showMessage('success', 'Configuration sauvegardée');
          setEditingKey(null);
          loadConfigs();
        } else {
          showMessage('error', 'Erreur lors de la sauvegarde');
        }
      } catch (error) {
        showMessage('error', `Erreur: ${error}`);
      }
    };

    return (
      <div className={styles.tabContent}>
        <h2>Configuration du Scraper</h2>

        <table className={styles.configTable}>
          <thead>
            <tr>
              <th>Clé</th>
              <th>Valeur</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(configs).map(([key, config]) => (
              <tr key={key}>
                <td><strong>{key}</strong></td>
                <td>
                  {editingKey === key ? (
                    <input
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className={styles.input}
                    />
                  ) : (
                    String(config.value)
                  )}
                </td>
                <td>{config.type}</td>
                <td>
                  {editingKey === key ? (
                    <>
                      <button
                        className={styles.btnSmall}
                        onClick={() => handleSaveConfig(key, editingValue, config.type)}
                      >
                        ✓
                      </button>
                      <button
                        className={styles.btnSmallSecondary}
                        onClick={() => setEditingKey(null)}
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <button
                      className={styles.btnSmall}
                      onClick={() => {
                        setEditingKey(key);
                        setEditingValue(String(config.value));
                      }}
                    >
                      ✎
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ==================== TAB: SCHEDULES ====================
  function SchedulesTab() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [newSchedule, setNewSchedule] = useState({
      cron_expression: '0 2 * * *',
      name: '',
      territories: ['gp'],
      max_pages: 10,
      enabled: true,
    });

    useEffect(() => {
      loadSchedules();
    }, [getToken, getAuthHeaders]);

    const loadSchedules = async () => {
      try {
        const currentToken = await getToken();
        const response = await fetch(
          `${API_BASE}/scraper/schedules`,
          { headers: getAuthHeaders(currentToken) }
        );
        const data = await response.json();
        if (data.success) {
          setSchedules(data.data);
        }
      } catch (error) {
        console.error('Erreur chargement horaires:', error);
      }
    };

    const handleAddSchedule = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const currentToken = await getToken();
        const response = await fetch(
          `${API_BASE}/scraper/schedules`,
          {
            method: 'POST',
            headers: getAuthHeaders(currentToken),
            body: JSON.stringify(newSchedule),
          }
        );

        if (response.ok) {
          showMessage('success', 'Horaire ajouté');
          setNewSchedule({
            cron_expression: '0 2 * * *',
            name: '',
            territories: ['gp'],
            max_pages: 10,
            enabled: true,
          });
          loadSchedules();
        } else {
          showMessage('error', 'Erreur lors de l\'ajout');
        }
      } catch (error) {
        showMessage('error', `Erreur: ${error}`);
      }
    };

    const handleDeleteSchedule = async (id: number) => {
      if (!confirm('Confirmer la suppression?')) return;

      try {
        const currentToken = await getToken();
        const response = await fetch(
          `${API_BASE}/scraper/schedules/${id}`,
          {
            method: 'DELETE',
            headers: getAuthHeaders(currentToken),
          }
        );

        if (response.ok) {
          showMessage('success', 'Horaire supprimé');
          loadSchedules();
        } else {
          showMessage('error', 'Erreur lors de la suppression');
        }
      } catch (error) {
        showMessage('error', `Erreur: ${error}`);
      }
    };

    return (
      <div className={styles.tabContent}>
        <h2>Horaires de Scraping</h2>

        <form onSubmit={handleAddSchedule} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="cron">Expression Cron</label>
            <input
              id="cron"
              type="text"
              placeholder="0 2 * * *"
              value={newSchedule.cron_expression}
              onChange={(e) => setNewSchedule({ ...newSchedule, cron_expression: e.target.value })}
              required
            />
            <small>Ex: "0 2 * * *" = 2h du matin, "*/30 * * * *" = tous les 30min</small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="scheduleName">Nom (optionnel)</label>
            <input
              id="scheduleName"
              type="text"
              value={newSchedule.name}
              onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
              placeholder="Ex: Scraping nocturne"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Territoires</label>
            <div className={styles.checkboxGroup}>
              {['gp', 'mq', 're', 'gf'].map((t) => (
                <label key={t}>
                  <input
                    type="checkbox"
                    checked={newSchedule.territories.includes(t)}
                    onChange={(e) => {
                      const territories = e.target.checked
                        ? [...newSchedule.territories, t]
                        : newSchedule.territories.filter((x) => x !== t);
                      setNewSchedule({ ...newSchedule, territories });
                    }}
                  />
                  {t === 'gp' ? 'Guadeloupe' : t === 'mq' ? 'Martinique' : t === 're' ? 'Réunion' : 'Guyane'}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="schedulePages">Pages à scraper</label>
            <input
              id="schedulePages"
              type="number"
              min="1"
              value={newSchedule.max_pages}
              onChange={(e) => setNewSchedule({ ...newSchedule, max_pages: parseInt(e.target.value) })}
            />
          </div>

          <label>
            <input
              type="checkbox"
              checked={newSchedule.enabled}
              onChange={(e) => setNewSchedule({ ...newSchedule, enabled: e.target.checked })}
            />
            Activé
          </label>

          <button type="submit" className={styles.btnPrimary}>
            ➕ Ajouter l'horaire
          </button>
        </form>

        <div className={styles.schedulesSection}>
          <h3>Horaires Existants</h3>
          {schedules.length === 0 ? (
            <p>Aucun horaire configuré</p>
          ) : (
            <div className={styles.schedulesList}>
              {schedules.map((schedule) => (
                <div key={schedule.id} className={styles.scheduleCard}>
                  <div>
                    <strong>Cron:</strong> {schedule.cron_expression}
                    {schedule.name && <p><strong>Nom:</strong> {schedule.name}</p>}
                    <p><strong>Territoires:</strong> {schedule.territories.join(', ')}</p>
                    <p><strong>Pages:</strong> {schedule.max_pages}</p>
                    <p><strong>Statut:</strong> {schedule.enabled ? '✅ Activé' : '❌ Désactivé'}</p>
                    {schedule.last_executed_at && (
                      <p><strong>Dernière exécution:</strong> {new Date(schedule.last_executed_at).toLocaleString()}</p>
                    )}
                  </div>
                  <button
                    className={styles.btnDanger}
                    onClick={() => handleDeleteSchedule(schedule.id)}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== TAB: HISTORY ====================
  function HistoryTab() {
    const [logs, setLogs] = useState<ExecutionLog[]>([]);
    const [filterTerritory, setFilterTerritory] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
      loadHistory();
    }, [getToken, getAuthHeaders, filterTerritory, filterStatus]);

    const loadHistory = async () => {
      try {
        const currentToken = await getToken();
        const params = new URLSearchParams();
        if (filterTerritory) params.append('territory', filterTerritory);
        if (filterStatus) params.append('status', filterStatus);

        const response = await fetch(
          `${API_BASE}/scraper/execution-history?${params}`,
          { headers: getAuthHeaders(currentToken) }
        );
        const data = await response.json();
        if (data.success) {
          setLogs(data.data);
        }
      } catch (error) {
        console.error('Erreur chargement historique:', error);
      }
    };

    return (
      <div className={styles.tabContent}>
        <h2>Historique des Exécutions</h2>

        <div className={styles.filterSection}>
          <input
            type="text"
            placeholder="Filtrer par territoire..."
            value={filterTerritory}
            onChange={(e) => setFilterTerritory(e.target.value)}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="completed">Complété</option>
            <option value="failed">Échoué</option>
            <option value="running">En cours</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>

        {logs.length === 0 ? (
          <p>Aucun historique</p>
        ) : (
          <table className={styles.logsTable}>
            <thead>
              <tr>
                <th>Task ID</th>
                <th>Statut</th>
                <th>Territoire</th>
                <th>Produits</th>
                <th>Durée</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className={styles.code}>{log.task_id.slice(0, 20)}...</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        log.status === 'completed'
                          ? styles.success
                          : log.status === 'failed'
                          ? styles.error
                          : styles.info
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td>{log.territory}</td>
                  <td>{log.total_products}</td>
                  <td>{log.duration_seconds ? `${log.duration_seconds.toFixed(2)}s` : '-'}</td>
                  <td>{new Date(log.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  // ==================== TAB: LOGS ====================
  function LogsTab() {
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
      const loadLogs = async () => {
        try {
          const response = await fetch(
            `${FASTAPI_BASE}/logs?lines=200`,
            { headers: { 'Content-Type': 'application/json' } }
          );
          const data = await response.json();
          if (data.logs) {
            setLogs(data.logs);
          }
        } catch (error) {
          console.error('Erreur chargement logs:', error);
        }
      };

      loadLogs();
      const interval = setInterval(loadLogs, 3000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className={styles.tabContent}>
        <h2>Logs FastAPI</h2>
        <div className={styles.logsContainer}>
          {logs.length === 0 ? (
            <p>Aucun log</p>
          ) : (
            logs.map((log, i) => (
              <pre key={i} className={styles.logLine}>
                {log}
              </pre>
            ))
          )}
        </div>
      </div>
    );
  }

  // ==================== TAB: FASTAPI ====================
  function FastAPITab() {
    const [systemStatus, setSystemStatus] = useState<any>(null);

    useEffect(() => {
      const loadStatus = async () => {
        try {
          const response = await fetch(
            `${FASTAPI_BASE}/system/status`,
            { headers: { 'Content-Type': 'application/json' } }
          );
          const data = await response.json();
          setSystemStatus(data);
        } catch (error) {
          console.error('Erreur chargement statut:', error);
        }
      };

      loadStatus();
      const interval = setInterval(loadStatus, 5000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className={styles.tabContent}>
        <h2>FastAPI - API Kiprix</h2>

        {systemStatus && (
          <div className={styles.statusCard}>
            <p><strong>Service:</strong> {systemStatus.service}</p>
            <p><strong>Version:</strong> {systemStatus.version}</p>
            <p><strong>Statut:</strong> <span className={styles.statusHealthy}>✅ {systemStatus.status}</span></p>
            <p><strong>Tâches en cours:</strong> {systemStatus.running_tasks}</p>
            <p><strong>Total de tâches:</strong> {systemStatus.total_tasks}</p>
          </div>
        )}

        <div className={styles.apiLinks}>
          <h3>Documentation et Endpoints</h3>
          <ul>
            <li>
              <a href={`${FASTAPI_BASE}/docs`} target="_blank" rel="noopener noreferrer">
                📖 Swagger UI (Documentation interactive)
              </a>
            </li>
            <li>
              <a href={`${FASTAPI_BASE}/redoc`} target="_blank" rel="noopener noreferrer">
                📚 ReDoc (Documentation alternative)
              </a>
            </li>
          </ul>
        </div>

        <div className={styles.copySection}>
          <h3>URL FastAPI</h3>
          <input type="text" value={FASTAPI_BASE} readOnly className={styles.input} />
        </div>
      </div>
    );
  }

  // Rendu des onglets
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'launch':
        return <LaunchTab />;
      case 'config':
        return <ConfigTab />;
      case 'schedules':
        return <SchedulesTab />;
      case 'history':
        return <HistoryTab />;
      case 'logs':
        return <LogsTab />;
      case 'fastapi':
        return <FastAPITab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🎛️ Dashboard d'Administration - Scraper Kiprix</h1>
      </header>

      {message && (
        <div className={`${styles.notification} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <div className={styles.tabsNav}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.tabsContent}>{renderActiveTab()}</div>
    </div>
  );
}
