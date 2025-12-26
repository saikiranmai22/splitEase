package com.splitwise.clone.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

public class SplitwiseException extends RuntimeException {
    public SplitwiseException(String message) {
        super(message);
    }
}

@ResponseStatus(HttpStatus.NOT_FOUND)
class ResourceNotFoundException extends SplitwiseException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

@ResponseStatus(HttpStatus.BAD_REQUEST)
class InvalidActionException extends SplitwiseException {
    public InvalidActionException(String message) {
        super(message);
    }
}

@ResponseStatus(HttpStatus.UNAUTHORIZED)
class UnauthorizedException extends SplitwiseException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
