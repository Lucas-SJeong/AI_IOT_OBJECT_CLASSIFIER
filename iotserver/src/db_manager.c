#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include "db_manager.h"

// SQLite 파일 로깅 또는 콘솔 감사 추적
static FILE* log_fp = NULL;

int db_init(void) {
    log_fp = fopen("factory_history.log", "a");
    if (!log_fp) {
        perror("Failed to open factory_history.log");
        return 0;
    }
    return 1;
}

int db_log_event(const char* event_type, const char* details) {
    if (!log_fp) return 0;
    
    time_t now = time(NULL);
    struct tm* t = localtime(&now);
    char time_str[32];
    strftime(time_str, sizeof(time_str), "%Y-%m-%d %H:%M:%S", t);

    fprintf(log_fp, "[%s] EVENT: %s | DETAILS: %s\n", time_str, event_type, details);
    fflush(log_fp);
    return 1;
}

void db_close(void) {
    if (log_fp) {
        fclose(log_fp);
        log_fp = NULL;
    }
}
