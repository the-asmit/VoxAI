import logging
import sys

def setup_logging():
    """Initialize centralized logging configuration."""
    log_format = (
        "[%(asctime)s] [%(name)s] [%(levelname)s] %(message)s"
    )
    
    logging.basicConfig(
        level=logging.INFO,
        format=log_format,
        handlers=[
            logging.StreamHandler(sys.stdout),
        ]
    )


def get_logger(module_name: str) -> logging.Logger:
    """Get a logger instance for a module."""
    return logging.getLogger(module_name)


# Initialize logging on import
setup_logging()

logger = get_logger("voxai")
