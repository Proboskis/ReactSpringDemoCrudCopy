package com.example.demo.student.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// This is so that we do not throw 400 exception to the client
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BadRequestException extends RuntimeException{

    public BadRequestException(String msg) { super(msg); }
}
