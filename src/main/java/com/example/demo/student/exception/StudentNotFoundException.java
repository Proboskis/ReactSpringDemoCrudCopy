package com.example.demo.student.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// This is so that we do not throw 404 exception to the client
@ResponseStatus(HttpStatus.NOT_FOUND)
public class StudentNotFoundException extends RuntimeException{

    public StudentNotFoundException(String msg) {
        super(msg);
    }
}
