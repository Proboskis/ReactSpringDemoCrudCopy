package com.example.demo.student;

import com.example.demo.student.exception.BadRequestException;
import com.example.demo.student.exception.StudentNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.rmi.StubNotFoundException;
import java.util.List;

@AllArgsConstructor
@Service // it is used, so we can inject this class, id. StudentService into the StudentController as a dependency injection.
public class StudentService {
    private final StudentRepository studentRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public void addStudent(Student student) {
        // check if email is taken
        Boolean existsEmail = studentRepository.selectExistsEmail(student.getEmail());
        if (existsEmail) {
            throw new BadRequestException("Email " + student.getEmail() + " taken");
        }
        studentRepository.save(student);
    }

    public void deleteStudent(Long studentId) {
        // check if student exists
        if(!studentRepository.existsById(studentId)) {
            throw new StudentNotFoundException("Student with the id of " + studentId + "does not exist");
        }
        studentRepository.deleteById(studentId);
    }
}
