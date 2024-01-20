package com.ll.gooHaeYu.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    // 직접 에러코드 추가  ex) LOGIN_FAIL(HttpStatus.NOT_FOUND, "일치하는 회원정보가 없습니다.")
    ;

    private final HttpStatus status;
    private final String message;
}