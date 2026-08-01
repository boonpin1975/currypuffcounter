#!/bin/bash
# ==============================================================================
# Curry Puff Counter - Systemd Service Installer & Control Helper
# ==============================================================================

SERVICE_NAME="currypuffcounter"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NODE_PATH="$(which node || echo "/usr/bin/node")"

# Color formatting
GREEN='\030[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

function show_usage() {
    echo -e "${YELLOW}Usage:${NC} sudo ./scripts/setup-systemd.sh [install | start | stop | restart | status | logs]"
    echo ""
    echo "  install  : Installs the systemd service file to /etc/systemd/system/"
    echo "  start    : Starts the currypuffcounter systemd service"
    echo "  stop     : Stops the service"
    echo "  restart  : Restarts the service"
    echo "  status   : Checks systemctl service status"
    echo "  logs     : Views live journalctl logs"
    exit 1
}

if [ -z "$1" ]; then
    show_usage
fi

case "$1" in
    install)
        echo -e "${GREEN}==> Installing Curry Puff Counter systemd service...${NC}"
        
        # Ensure root execution for systemctl
        if [ "$EUID" -ne 0 ]; then
            echo -e "${RED}Error: Please run with sudo: sudo ./scripts/setup-systemd.sh install${NC}"
            exit 1
        fi

        # Generate service file dynamically with current paths
        cat <<EOF > "$SERVICE_FILE"
[Unit]
Description=Curry Puff Counter Web Application Service
After=network.target

[Service]
Type=simple
User=${SUDO_USER:-root}
WorkingDirectory=${APP_DIR}
ExecStart=${NODE_PATH} server.js
Restart=always
RestartSec=5

# Environment configuration
Environment=NODE_ENV=production
Environment=PORT=6000
Environment=JWT_SECRET=curry-puff-secret-key-super-secure-2026
Environment=DATABASE_URL="file:./dev.db"

# Output logging
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=${SERVICE_NAME}

[Install]
WantedBy=multi-user.target
EOF

        chmod 644 "$SERVICE_FILE"
        systemctl daemon-reload
        systemctl enable "$SERVICE_NAME"
        systemctl start "$SERVICE_NAME"
        
        echo -e "${GREEN}✔ Service installed, enabled, and started on Port 6000!${NC}"
        systemctl status "$SERVICE_NAME" --no-pager
        ;;

    start)
        echo -e "${GREEN}==> Starting ${SERVICE_NAME} service...${NC}"
        systemctl start "$SERVICE_NAME"
        systemctl status "$SERVICE_NAME" --no-pager
        ;;

    stop)
        echo -e "${YELLOW}==> Stopping ${SERVICE_NAME} service...${NC}"
        systemctl stop "$SERVICE_NAME"
        ;;

    restart)
        echo -e "${GREEN}==> Restarting ${SERVICE_NAME} service...${NC}"
        systemctl restart "$SERVICE_NAME"
        systemctl status "$SERVICE_NAME" --no-pager
        ;;

    status)
        systemctl status "$SERVICE_NAME"
        ;;

    logs)
        journalctl -u "$SERVICE_NAME" -f -n 100
        ;;

    *)
        show_usage
        ;;
esac
