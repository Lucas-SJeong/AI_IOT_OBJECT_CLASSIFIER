#ifndef DB_MANAGER_H
#define DB_MANAGER_H

int db_init(void);
int db_log_event(const char* event_type, const char* details);
void db_close(void);

#endif // DB_MANAGER_H
